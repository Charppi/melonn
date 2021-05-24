import { Controller, Get } from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';

@Controller('shipping-method')
export class ShippingMethodController {

    constructor(private shippingMethodService: ShippingMethodService) { }

    @Get()
    async getAll() {
        return await this.shippingMethodService.getShippingMethods();
    }
}
