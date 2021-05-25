import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DaysOffService } from 'src/days-off/days-off.service';
import { db } from 'src/db';
import { ShippingMethodService, DaysTypes, PromisesTypes, PromiseBody } from 'src/shipping-method/shipping-method.service';
import { CreateOrderDto, Item } from './dtos/create-order.dto';
import * as moment from 'moment';


@Injectable()
export class CreateSellOrderService {

    constructor(
        private shippingMethodService: ShippingMethodService,
        private daysOffService: DaysOffService
    ) { }

    async createSellOrder(sellOrder: CreateOrderDto) {
        let created = false;
        const { rules } = await this.shippingMethodService.getShippingMethod(sellOrder.shippingMethod);
        const { cases } = rules.promisesParameters;
        const daysOff = await this.daysOffService.getDaysOff();
        const businessDay = this.daysOffService.getNext10BusinessDays(daysOff);
        const now = moment();

        sellOrder.internalOrderNumber = this.setInternalOrderNumber(now);
        sellOrder.creationDate = now.utc().format();

        const isDayOff = this.daysOffService.isDayOff(sellOrder.creationDate, daysOff);
        const orderWeight = this.getorderWight(sellOrder.items);

        const { min, max } = rules.availability.byWeight
        let priority = 1;

        if (!this.weightValidation(min, orderWeight, max)) {
            sellOrder = this.setNullPromises(sellOrder);
            this.saveOrder(sellOrder);
            return sellOrder
        }

        const { dayType, fromTimeOfDay, toTimeOfDay } = rules.availability.byRequestTime;


        this.validateNonBusinessandNotWeekend(dayType);

        if (isDayOff) {
            sellOrder = this.setNullPromises(sellOrder);
            this.saveOrder(sellOrder);
            return sellOrder
        }

        const hour = now.hour()
        const dayValidation = (fromTimeOfDay <= hour) && (hour <= toTimeOfDay)

        if (!dayValidation) {
            sellOrder = this.setNullPromises(sellOrder);
            this.saveOrder(sellOrder);
            return sellOrder
        }


        do {
            const workingCase = this.getCaseByPriority(priority, cases);

            this.validateWorkingCase(workingCase);

            const {
                workingCaseDayType,
                workingCaseToTimeOfDay,
                workingCaseFromTimeOfDay
            } = this.getWorkingCaseData(workingCase.condition.byRequestTime);


            this.validateNonBusinessAndNotWeekendDay(workingCaseDayType);

            if (this.isBusinessDayAndIsDayOff(workingCaseDayType, isDayOff)) {
                priority++;
                continue;
            }

            if (!this.workingDayValidation(workingCaseFromTimeOfDay, hour, workingCaseToTimeOfDay)) {
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

    private isBusinessDayAndIsDayOff = (workingCaseDayType: string, isDayOff: boolean) => {
        return workingCaseDayType === DaysTypes.BUSINESS && isDayOff
    }

    private weightValidation(min: number, orderWeight: number, max: number) {
        return (min <= orderWeight) && (orderWeight <= max);
    }

    private validateNonBusinessandNotWeekend(dayType: any) {
        if (dayType === DaysTypes.NON_BUSINESS || dayType === DaysTypes.WEEKEND) {
            throw new HttpException('Not for now', HttpStatus.FORBIDDEN);
        }
    }

    private setPromises(workingCase: any, sellOrder: CreateOrderDto, now: moment.Moment, businessDay: string[]) {
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

    private workingDayValidation(workingCaseFromTimeOfDay: number, hour: number, workingCaseToTimeOfDay: number) {
        return (workingCaseFromTimeOfDay <= hour) && (hour <= workingCaseToTimeOfDay);
    }

    private validateNonBusinessAndNotWeekendDay(workingCaseDayType: any) {
        if (workingCaseDayType === DaysTypes.NON_BUSINESS || workingCaseDayType === DaysTypes.WEEKEND) {
            throw new HttpException('Not for now', HttpStatus.FORBIDDEN);
        }
    }

    private getWorkingCaseData(workingCaseConditionByRequestTime: any) {
        const {
            dayType: workingCaseDayType,
            toTimeOfDay: workingCaseToTimeOfDay,
            fromTimeOfDay: workingCaseFromTimeOfDay } = workingCaseConditionByRequestTime;
        return { workingCaseDayType, workingCaseToTimeOfDay, workingCaseFromTimeOfDay };
    }

    private validateWorkingCase(workingCase: any) {
        if (!workingCase) {
            throw new HttpException('This should not happen', HttpStatus.FORBIDDEN);
        }
    }

    private saveOrder(sellOrder: CreateOrderDto) {
        db.push(`orders/${sellOrder.internalOrderNumber}`, sellOrder);
    }

    private setNullPromises(sellOrder: CreateOrderDto) {
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


    private getorderWight(items: Item[]) {
        return items.map(item => item.productWeight).reduce((prev, next) => prev + next)
    }


    private setInternalOrderNumber(now: moment.Moment): string {
        return `MSE${now.unix()}${Math.floor(Math.random() * 100) + 1}`;
    }
}
