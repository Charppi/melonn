import { Injectable } from '@nestjs/common';
import { axiosInstance } from '../axios/config';

export enum DaysTypes {
    ANY = "ANY",
    BUSINESS = "BUSINESS",
    NON_BUSINESS = "NON-BUSINESS",
    WEEKEND = "WEEKEND"
}

export enum PromisesTypes {
    DELTA_HOUR = "DELTA-HOURS",
    DELTA_BUSINESS = "DELTA-BUSINESSDAYS",
    NULL = "NULL"
}


export interface PromiseBody {
    type: PromisesTypes,
    deltaHours?: number,
    deltaBusinessDays?: number
    timeOfDay: number
}

export interface Rules {
    availability: RulesAvailability
    promisesParameters: PromisesParameters
}

export interface RulesAvailability {
    byWeight: {
        min: number
        max: number
    },
    byRequestTime: ByRequestTimeCondition,
    /** Por el momento no se usa */
    byWarehouseCoverage: {
        type: string
    }
}

export interface PromisesParameters {
    cases: Case[]
}

export interface PromiseInterface {
    min: PromiseBody,
    max: PromiseBody,
}

export interface ByRequestTimeCondition {
    dayType: DaysTypes,
    fromTimeOfDay: number,
    toTimeOfDay: number
}

interface Case {
    priority: number,
    condition: {
        byRequestTime: ByRequestTimeCondition
    },
    packPromise: PromiseInterface,
    shipPromise: PromiseInterface,
    deliveryPromise: PromiseInterface,
    readyPickUpPromise: PromiseInterface
}

export interface ShippingMethodInterface {
    id: number
    name: string
    description: string
    code: string
    shipping_type: string
    rules: Rules

}

@Injectable()
export class ShippingMethodService {

    async getShippingMethod(id: number) {
        return (await axiosInstance.get(`/shipping-methods/${id}`)).data as ShippingMethodInterface;
    }
    async getShippingMethods() {
        return (await axiosInstance.get(`/shipping-methods`)).data;
    }

}
