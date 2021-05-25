import { Injectable } from '@nestjs/common';
import { axiosInstance } from 'src/axios/config';
import * as moment from 'moment';

@Injectable()
export class DaysOffService {

    isDayOff(currentDate: string, daysOff: string[]) {
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
            const businessDay = now.add(index, 'days');
            const businessDayFormatted = businessDay.format("YYYY-MM-DD");
            const isDayOff = daysOff.some(date => date === businessDayFormatted);
            if (!isDayOff) {
                businessDays.push(businessDayFormatted)
            }
        }
        return businessDays;
    }

}
