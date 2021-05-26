import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DaysTypes } from "src/shipping-method/shipping-method.service";
import { CreateOrderDto } from "../dtos/create-order.dto";

@Injectable()
export class CreateSellOrderValidations {
    validateItems(data: CreateOrderDto) {
        if (!data.items || data.items.length == 0) {
            throw new HttpException('This should not happen, please set items object', HttpStatus.BAD_REQUEST);
        }
    }
    isBusinessDayAndIsDayOff = (workingCaseDayType: string, isDayOff: boolean) => {
        return workingCaseDayType === DaysTypes.BUSINESS && isDayOff
    }

    weightValidation(min: number, orderWeight: number, max: number) {
        return (min <= orderWeight) && (orderWeight <= max);
    }

    validateNonBusinessandNotWeekend(dayType: DaysTypes) {
        if (dayType === DaysTypes.NON_BUSINESS || dayType === DaysTypes.WEEKEND) {
            throw new HttpException('Not for now', HttpStatus.BAD_REQUEST);
        }
    }

    workingDayValidation(workingCaseFromTimeOfDay: number, hour: number, workingCaseToTimeOfDay: number) {
        return (workingCaseFromTimeOfDay <= hour) && (hour <= workingCaseToTimeOfDay);
    }

    validateWorkingCase(workingCase: any) {
        if (!workingCase) {
            throw new HttpException('This should not happen', HttpStatus.BAD_REQUEST);
        }
    }
    dayValidation(fromTimeOfDay: number, hour: number, toTimeOfDay: number) {
        return (fromTimeOfDay <= hour) && (hour <= toTimeOfDay);
    }


}