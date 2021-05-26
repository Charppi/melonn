import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto'
import { CreateSellOrderService } from './create-sell-order/create-sell-order.service';
import { GetSellOrderService } from './get-sell-order/get-sell-order.service';

export interface Pagination {
    limit: number, offset: number
}

@Controller('sell-order')
export class SellOrderController {

    constructor(
        private createSellOrderService: CreateSellOrderService,
        private getSellOrderService: GetSellOrderService
    ) { }

    @Post()
    create(@Body() sellOrder: CreateOrderDto) {
        return this.createSellOrderService.createSellOrder(sellOrder);
    }

    @Get()
    getAll(@Query() data: Pagination) {
        console.log(data);
        return this.getSellOrderService.getAll(data);
    }

    @Get("/:internalNumber")
    getOne(@Param() { internalNumber }: { internalNumber: string }) {
        return this.getSellOrderService.getOne(internalNumber);
    }

}
