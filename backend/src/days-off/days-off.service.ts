import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { axiosInstance } from 'src/axios/config';

@Injectable()
export class DaysOffService {

    async isDayOff(currentDate: string, daysOff: string[]) {
        return daysOff.some((date: string) => date === currentDate);
    }

    async getDaysOff() {
        return (await (axiosInstance.get(`/off-days`))).data;
    }

    getNext10BusinessDays(daysOff: string[]) {
        let now = moment();
        const businessDays: string[] = [];

        while (businessDays.length <= 10) {
            const index = businessDays.length + 1;
            const businessDay = now.add(index, 'day')
            const businessDayFormatted = businessDay.format("YYY-MM-DD");
            const isDayOff = daysOff.some(date => date === businessDayFormatted);
            if (!isDayOff) {
                businessDays.push(businessDayFormatted)
            }
        }
        return businessDays;
    }

}
