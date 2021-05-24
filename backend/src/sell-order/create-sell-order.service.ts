import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import moment from 'moment';
import { DaysOffService } from 'src/days-off/days-off.service';
import { db } from 'src/db';
import { ShippingMethodService, DaysTypes, PromisesTypes, PromiseBody } from 'src/shipping-method/shipping-method.service';
import { CreateOrderDto, Item } from './dtos/create-order.dto';


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
        sellOrder.creationDate = now.utc().format("YYYY-MM-DD");

        const isDayOff = this.daysOffService.isDayOff(sellOrder.creationDate, daysOff);
        const orderWeight = this.getorderWight(sellOrder.items);
        const { minWeight, maxWeight } = rules.availability.byWeight
        let priority = 1;

        const weightValidation = (minWeight <= orderWeight <= maxWeight)

        if (!weightValidation) {
            this.saveOrder(sellOrder);
            return this.setNullPromises(sellOrder);
        }

        const { dayType, fromTimeOfDay, toTimeOfDay } = rules.availability.byRequestTime;

        if (dayType === DaysTypes.NON_BUSINESS || dayType === DaysTypes.WEEKEND) {
            throw new HttpException('Not for now', HttpStatus.FORBIDDEN);
        }

        if (isDayOff) {
            this.saveOrder(sellOrder);
            return this.setNullPromises(sellOrder);
        }

        const hour = now.hour()
        const dayValidation = fromTimeOfDay <= hour <= toTimeOfDay
        if (dayValidation) {
            this.saveOrder(sellOrder);
            return this.setNullPromises(sellOrder);
        }


        do {
            const workingCase = this.getCaseByPriority(priority, cases);
            if (!workingCase) {
                throw new HttpException('This should not happen', HttpStatus.FORBIDDEN);

            }
            const {
                dayType: workingCaseDayType,
                toTimeOfDay: workingCaseToTimeOfDay,
                fromTimeOfDay: workingCaseFromTimeOfDay } = workingCase.condition.byRequestTime;
            if (workingCaseDayType === DaysTypes.NON_BUSINESS || workingCaseDayType === DaysTypes.WEEKEND) {
                throw new HttpException('Not for now', HttpStatus.FORBIDDEN);
            }

            if (workingCaseDayType === DaysTypes.BUSINESS) {

                if (isDayOff) {
                    priority++;
                    continue;
                }
            }

            const workingDayValidation = (workingCaseFromTimeOfDay <= hour <= workingCaseToTimeOfDay);

            if (!workingDayValidation) {
                priority++;
                continue;
            }

            const { packPromise, shipPromise, deliveryPromise, readyPickUpPromise } = workingCase;

            sellOrder.packPromiseMin = this.setPromise(packPromise, now, businessDay);
            sellOrder.packPromiseMax = this.setPromise(packPromise, now, businessDay);

            sellOrder.shipPromiseMin = this.setPromise(shipPromise, now, businessDay);
            sellOrder.shipPromiseMax = this.setPromise(shipPromise, now, businessDay);

            sellOrder.deliveryPromiseMin = this.setPromise(deliveryPromise, now, businessDay);
            sellOrder.deliveryPromiseMax = this.setPromise(deliveryPromise, now, businessDay);

            sellOrder.deliveryPromiseMin = this.setPromise(readyPickUpPromise, now, businessDay);
            sellOrder.deliveryPromiseMax = this.setPromise(readyPickUpPromise, now, businessDay);

            this.saveOrder(sellOrder);

            return sellOrder

        }
        while (!created)

    }

    private saveOrder(sellOrder: CreateOrderDto) {
        db.push('orders', sellOrder);
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
        if (type === PromisesTypes.DELTA_HOUR) return now.add(deltaHours, "hours").calendar();
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
