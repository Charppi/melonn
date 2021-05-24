import { Injectable } from '@nestjs/common';
import { axiosInstance } from 'src/axios/config';

export enum DaysTypes {
    ANY = "ANY",
    BUSINESS = "BUSINESS",
    NON_BUSINESS = "NON-BUSINESS",
    WEEKEND = "WEEKEND"
}

export enum PromisesTypes {
    DELTA_HOUR = "DELTA HOUR",
    DELTA_BUSINESS = "DELTA BUSINESS",
    NULL = "NULL"
}


export interface PromiseBody {
    type: PromisesTypes,
    deltaHours?: number,
    deltaBusinessDays?: number
    timeOfDay: number
}

@Injectable()
export class ShippingMethodService {

    async getShippingMethod(id: number) {
        return (await axiosInstance.get(`/shipping-methods/${id}`)).data;
    }
    async getShippingMethods() {
        return (await axiosInstance.get(`/shipping-methods`)).data;
    }

}
