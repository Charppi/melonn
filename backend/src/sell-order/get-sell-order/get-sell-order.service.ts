import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { Pagination } from '../sell-order.controller';

@Injectable()
export class GetSellOrderService {
    getAll({ limit, offset }: Pagination) {
        offset = Number(offset);
        limit = Number(limit);
        const orders = db.getData("/");
        const data = [];
        const response = [];
        for (const i in orders) {
            data.push(orders[i]);
        }
        if (offset > data.length) return [];
        for (let i = 0; i < limit; i++) {
            const element = data[offset + i];
            if (!element) continue;
            response.push(element);
        }
        return { response, total: data.length };
    }
    getOne(internalCode: string) {
        try {
            return db.getData(`/${internalCode}`);
        } catch (error) {
            throw new HttpException("Not found", HttpStatus.NOT_FOUND);
        }
    }
}
