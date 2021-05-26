import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DaysOffService } from '../../days-off/days-off.service';
import { db } from '../../db';
import { ShippingMethodService, DaysTypes, PromisesTypes, PromiseBody } from '../../shipping-method/shipping-method.service';
import { CreateOrderDto, Item } from '../dtos/create-order.dto';
import * as moment from 'moment';
import { CreateSellOrderValidations } from './create-sell-order-validations';

export class CreateOrderResponse extends CreateOrderDto {
    creationDate: string
    internalOrderNumber: string
    packPromiseMin: string
    packPromiseMax: string
    shipPromiseMin: string
    shipPromiseMax: string
    deliveryPromiseMin: string
    deliveryPromiseMax: string
    readyPickupPromiseMin: string
    readyPickupPromiseMax: string
    shippingMethodName: string
}

@Injectable()
export class CreateSellOrderService {

    constructor(
        private shippingMethodService: ShippingMethodService,
        private daysOffService: DaysOffService,
        private validations: CreateSellOrderValidations
    ) { }

    public async createSellOrder(data: CreateOrderDto) {
        let created = false;
        this.validations.validateItems(data);
        const { rules, name } = await this.shippingMethodService.getShippingMethod(data.shippingMethod);
        const { cases } = rules.promisesParameters;
        const daysOff = await this.daysOffService.getDaysOff();
        const businessDay = this.daysOffService.getNext10BusinessDays(daysOff);
        const now = moment();
        let sellOrder: CreateOrderResponse = this.setSellOrder(data);
        sellOrder.internalOrderNumber = this.setInternalOrderNumber(now);
        sellOrder.creationDate = now.utc().format();
        sellOrder.shippingMethodName = name;
        const isDayOff = this.daysOffService.isDayOff(sellOrder.creationDate, daysOff);
        const orderWeight = this.getOrderWeight(sellOrder.items);
        const { min, max } = rules.availability.byWeight
        let priority = 1;
        if (!this.validations.weightValidation(min, orderWeight, max)) {
            sellOrder = this.setNullPromises(sellOrder);
            this.saveOrder(sellOrder);
            return sellOrder
        }
        const { dayType, fromTimeOfDay, toTimeOfDay } = rules.availability.byRequestTime;
        this.validations.validateNonBusinessandNotWeekend(dayType);
        if (isDayOff) {
            sellOrder = this.setNullPromises(sellOrder);
            this.saveOrder(sellOrder);
            return sellOrder
        }
        const hour = now.hour()
        const dayValidation = this.validations.dayValidation(fromTimeOfDay, hour, toTimeOfDay)
        if (!dayValidation) {
            sellOrder = this.setNullPromises(sellOrder);
            this.saveOrder(sellOrder);
            return sellOrder
        }
        do {
            const workingCase = this.getCaseByPriority(priority, cases);
            this.validations.validateWorkingCase(workingCase);
            const {
                workingCaseDayType,
                workingCaseToTimeOfDay,
                workingCaseFromTimeOfDay
            } = this.getWorkingCaseData(workingCase.condition.byRequestTime);
            this.validations.validateNonBusinessandNotWeekend(workingCaseDayType);

            if (this.validations.isBusinessDayAndIsDayOff(workingCaseDayType, isDayOff)) {
                priority++;
                continue;
            }
            if (!this.validations.workingDayValidation(workingCaseFromTimeOfDay, hour, workingCaseToTimeOfDay)) {
                priority++;
                continue;
            }
            sellOrder = this.setPromises(workingCase, sellOrder, now, businessDay);
            created = true;
        }
        while (!created)
        this.saveOrder(sellOrder);
        return sellOrder;

    }



    private setSellOrder(data: CreateOrderDto) {
        const sellOrder = new CreateOrderResponse();
        sellOrder.buyerEmail = data.buyerEmail;
        sellOrder.buyerFullName = data.buyerFullName;
        sellOrder.buyerPhone = data.buyerPhone;
        sellOrder.orderNumber = data.orderNumber;
        sellOrder.sellerStore = data.sellerStore;
        sellOrder.shippingAddress = data.shippingAddress;
        sellOrder.shippingCity = data.shippingCity;
        sellOrder.shippingCountry = data.shippingCountry;
        sellOrder.shippingMethod = data.shippingMethod;
        sellOrder.shippingRegion = data.shippingRegion;
        sellOrder.items = data.items;
        return sellOrder
    }


    private setPromises(workingCase: any, sellOrder: CreateOrderResponse, now: moment.Moment, businessDay: string[]) {
        const { packPromise, shipPromise, deliveryPromise, readyPickUpPromise } = workingCase;

        sellOrder.packPromiseMin = this.setPromise(packPromise.min, now, businessDay);
        sellOrder.packPromiseMax = this.setPromise(packPromise.max, now, businessDay);

        sellOrder.shipPromiseMin = this.setPromise(shipPromise.min, now, businessDay);
        sellOrder.shipPromiseMax = this.setPromise(shipPromise.max, now, businessDay);

        sellOrder.deliveryPromiseMin = this.setPromise(deliveryPromise.min, now, businessDay);
        sellOrder.deliveryPromiseMax = this.setPromise(deliveryPromise.max, now, businessDay);

        sellOrder.deliveryPromiseMin = this.setPromise(readyPickUpPromise.min, now, businessDay);
        sellOrder.deliveryPromiseMax = this.setPromise(readyPickUpPromise.max, now, businessDay);

        return sellOrder
    }


    private getWorkingCaseData(workingCaseConditionByRequestTime: any) {
        const {
            dayType: workingCaseDayType,
            toTimeOfDay: workingCaseToTimeOfDay,
            fromTimeOfDay: workingCaseFromTimeOfDay } = workingCaseConditionByRequestTime;
        return { workingCaseDayType, workingCaseToTimeOfDay, workingCaseFromTimeOfDay };
    }

    saveOrder(sellOrder: CreateOrderResponse) {
        db.push(`orders/${sellOrder.internalOrderNumber}`, sellOrder);
    }

    private setNullPromises(sellOrder: CreateOrderResponse) {
        sellOrder.packPromiseMin = null;
        sellOrder.packPromiseMax = null;
        sellOrder.shipPromiseMin = null;
        sellOrder.shipPromiseMax = null;
        sellOrder.deliveryPromiseMin = null;
        sellOrder.deliveryPromiseMax = null;
        sellOrder.readyPickupPromiseMin = null;
        sellOrder.readyPickupPromiseMax = null;
        return sellOrder;
    }

    private setPromise({ timeOfDay, type, deltaBusinessDays, deltaHours }: PromiseBody, now: moment.Moment, businessDays: string[]) {

        if (type === PromisesTypes.NULL) return null;
        if (type === PromisesTypes.DELTA_HOUR) return now.utc().add(deltaHours, "hours").format();
        if (type === PromisesTypes.DELTA_BUSINESS) {
            const date = businessDays[deltaBusinessDays - 1];
            return moment(`${date}T${timeOfDay}:00:00`).utc().format()
        }
    }

    private getCaseByPriority(priority: number, cases: any[]) {
        return cases.find(workingCase => parseInt(workingCase.priority) === priority)
    }

    private getOrderWeight(items: Item[]) {
        return items.map(item => item.productWeight).reduce((prev, next) => prev + next)
    }

    private setInternalOrderNumber(now: moment.Moment): string {
        return `MSE${now.unix()}${Math.floor(Math.random() * 100) + 1}`;
    }
}
