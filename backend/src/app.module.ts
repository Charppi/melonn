import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SellOrderController } from './sell-order/sell-order.controller';
import { CreateSellOrderService } from './sell-order/create-sell-order/create-sell-order.service';
import { ShippingMethodService } from './shipping-method/shipping-method.service';
import { DaysOffService } from './days-off/days-off.service';
import { ShippingMethodController } from './shipping-method/shipping-method.controller';
import { CreateSellOrderValidations } from './sell-order/create-sell-order/create-sell-order-validations';
import { GetSellOrderService } from './sell-order/get-sell-order/get-sell-order.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.development.env',
    isGlobal: true
  })],
  controllers: [AppController, SellOrderController, ShippingMethodController],
  providers: [AppService, CreateSellOrderService, ShippingMethodService, DaysOffService, CreateSellOrderValidations, GetSellOrderService],
})
export class AppModule { }
