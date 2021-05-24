import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto'
import { CreateSellOrderService } from './create-sell-order.service';

@Controller('sell-order')
export class SellOrderController {

    constructor(private createSellOrderService: CreateSellOrderService) { }

    @Post()
    create(@Body() sellOrder: CreateOrderDto) {
        this.createSellOrderService.createSellOrder(sellOrder);
    }
}
