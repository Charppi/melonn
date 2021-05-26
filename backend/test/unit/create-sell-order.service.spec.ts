
import { HttpException, HttpStatus } from '@nestjs/common';
import { DaysOffService } from '../../src/days-off/days-off.service';
import { CreateSellOrderService } from '../../src/sell-order/create-sell-order/create-sell-order.service';
import { CreateOrderDto } from '../../src/sell-order/dtos/create-order.dto';
import { DaysTypes, PromisesTypes, ShippingMethodInterface, ShippingMethodService } from '../../src/shipping-method/shipping-method.service';
import { stub } from 'sinon'
import { CreateSellOrderValidations } from 'src/sell-order/create-sell-order/create-sell-order-validations';

describe('Test to CreateSellOrderService', () => {
    let validations: CreateSellOrderValidations;
    let createSellOrderService: CreateSellOrderService;
    let shippingMethodService: ShippingMethodService
    let daysoffService: DaysOffService
    beforeEach(() => {
        shippingMethodService = new ShippingMethodService()
        daysoffService = new DaysOffService()
        validations = new CreateSellOrderValidations();
        createSellOrderService = new CreateSellOrderService(shippingMethodService, daysoffService, validations)
    });

    it('Should create the sale order', async () => {
        const sellOrder: CreateOrderDto = {
            buyerEmail: "carlosmc_2000@hotmail.com",
            buyerFullName: "Carlos Alvis Mendez Cifuentes",
            buyerPhone: "3224790059",
            orderNumber: 123,
            sellerStore: "Lacoste",
            shippingAddress: "Calle 123",
            shippingCity: "Arauca",
            shippingCountry: "Colombia",
            shippingMethod: 1,
            shippingRegion: "Arauca",
            items: [{
                productName: "Tomate de arbol",
                productQuantity: 2,
                productWeight: 5
            }]
        }
        const result = await createSellOrderService.createSellOrder(sellOrder);
        expect(typeof result).toBe("object");
    })

    it('Should return promises fields on null when the items have a non valid weight', async () => {
        const sellOrder: CreateOrderDto = {
            buyerEmail: "carlosmc_2000@hotmail.com",
            buyerFullName: "Carlos Alvis Mendez Cifuentes",
            buyerPhone: "3224790059",
            orderNumber: 123,
            sellerStore: "Lacoste",
            shippingAddress: "Calle 123",
            shippingCity: "Arauca",
            shippingCountry: "Colombia",
            shippingMethod: 1,
            shippingRegion: "Arauca",
            items: [{
                productName: "Tomate de arbol",
                productQuantity: 2,
                productWeight: 200
            }]
        }
        const result = await createSellOrderService.createSellOrder(sellOrder);
        expect(result.shipPromiseMax).toBe(null);
        expect(result.packPromiseMin).toBe(null);
        expect(result.packPromiseMax).toBe(null);
        expect(result.deliveryPromiseMin).toBe(null);
        expect(result.deliveryPromiseMax).toBe(null);
        expect(result.readyPickupPromiseMin).toBe(null);
        expect(result.readyPickupPromiseMax).toBe(null);
    });

    it('Should fail to create the sale order when the items field is missing', async () => {
        const sellOrder: any = {
            buyerEmail: "carlosmc_2000@hotmail.com",
            buyerFullName: "Carlos Alvis Mendez Cifuentes",
            buyerPhone: "3224790059",
            orderNumber: 123,
            sellerStore: "Lacoste",
            shippingAddress: "Calle 123",
            shippingCity: "Arauca",
            shippingCountry: "Colombia",
            shippingMethod: 1,
            shippingRegion: "Arauca"
        }
        try {
            await createSellOrderService.createSellOrder(sellOrder);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
        }
    });
    const sellOrder: CreateOrderDto = {
        buyerEmail: "carlosmc_2000@hotmail.com",
        buyerFullName: "Carlos Alvis Mendez Cifuentes",
        buyerPhone: "3224790059",
        orderNumber: 1,
        sellerStore: "Lacoste",
        shippingAddress: "Calle 123",
        shippingCity: "Arauca",
        shippingCountry: "Colombia",
        shippingMethod: 1,
        shippingRegion: "Arauca",
        items: [{
            productName: "Tomate de arbol",
            productQuantity: 2,
            productWeight: 5
        }]
    }
    it('Should fail to create the sale order when the dayType is weekend or non-business', async () => {
        const shippingMethod: ShippingMethodInterface = {
            code: "MSM-AD-0005",
            description: "Envio subacional",
            id: 7,
            name: "Envio subacional",
            shipping_type: "Delivery",
            rules: {
                availability: {
                    byRequestTime: {
                        dayType: DaysTypes.WEEKEND,
                        fromTimeOfDay: 0,
                        toTimeOfDay: 2
                    },
                    byWarehouseCoverage: {
                        type: "ALL"
                    },
                    byWeight: {
                        max: 10,
                        min: 0
                    }
                },
                promisesParameters: {
                    cases: [{
                        priority: 1,
                        condition: {
                            byRequestTime: {
                                dayType: DaysTypes.WEEKEND,
                                fromTimeOfDay: 0,
                                toTimeOfDay: 0
                            }
                        },
                        deliveryPromise: {
                            min: {
                                timeOfDay: 1,
                                type: PromisesTypes.DELTA_BUSINESS,
                                deltaBusinessDays: 2,
                                deltaHours: 2
                            },
                            max: {
                                timeOfDay: 1,
                                type: PromisesTypes.DELTA_BUSINESS,
                                deltaBusinessDays: 2,
                                deltaHours: 2
                            },
                        },
                        shipPromise: {
                            min: {
                                timeOfDay: 1,
                                type: PromisesTypes.DELTA_BUSINESS,
                                deltaBusinessDays: 2,
                                deltaHours: 2
                            },
                            max: {
                                timeOfDay: 1,
                                type: PromisesTypes.DELTA_BUSINESS,
                                deltaBusinessDays: 2,
                                deltaHours: 2
                            },
                        },
                        packPromise: {
                            min: {
                                timeOfDay: 1,
                                type: PromisesTypes.DELTA_BUSINESS,
                                deltaBusinessDays: 2,
                                deltaHours: 2
                            },
                            max: {
                                timeOfDay: 1,
                                type: PromisesTypes.DELTA_BUSINESS,
                                deltaBusinessDays: 2,
                                deltaHours: 2
                            },
                        },
                        readyPickUpPromise: {
                            min: {
                                timeOfDay: 1,
                                type: PromisesTypes.DELTA_BUSINESS,
                                deltaBusinessDays: 2,
                                deltaHours: 2
                            },
                            max: {
                                timeOfDay: 1,
                                type: PromisesTypes.DELTA_BUSINESS,
                                deltaBusinessDays: 2,
                                deltaHours: 2
                            },
                        }
                    }]
                }
            }
        }
        stub(shippingMethodService, "getShippingMethod").returns(Promise.resolve(shippingMethod));
        try {
            await createSellOrderService.createSellOrder(sellOrder);
            fail("No debería llegar acá ya que no pasa la validación del tipo de día");
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException)
        }
    });
    it('Should fail to create the sale order when is dayOff', async () => {
        const sellOrder: CreateOrderDto = {
            buyerEmail: "carlosmc_2000@hotmail.com",
            buyerFullName: "Carlos Alvis Mendez Cifuentes",
            buyerPhone: "3224790059",
            orderNumber: 1,
            sellerStore: "Lacoste",
            shippingAddress: "Calle 123",
            shippingCity: "Arauca",
            shippingCountry: "Colombia",
            shippingMethod: 1,
            shippingRegion: "Arauca",
            items: [{
                productName: "Tomate de arbol",
                productQuantity: 2,
                productWeight: 5
            }]
        }
        stub(daysoffService, "isDayOff").returns(true);
        const result = await createSellOrderService.createSellOrder(sellOrder);
        expect(result.shipPromiseMax).toBe(null);
        expect(result.packPromiseMin).toBe(null);
        expect(result.packPromiseMax).toBe(null);
        expect(result.deliveryPromiseMin).toBe(null);
        expect(result.deliveryPromiseMax).toBe(null);
        expect(result.readyPickupPromiseMin).toBe(null);
        expect(result.readyPickupPromiseMax).toBe(null);
    });
    it('Should fail to create the sale order when the date validation (fromTimeOfDay <= hour) && (hour <= toTimeOfDay) !== true', async () => {
        const sellOrder: CreateOrderDto = {
            buyerEmail: "carlosmc_2000@hotmail.com",
            buyerFullName: "Carlos Alvis Mendez Cifuentes",
            buyerPhone: "3224790059",
            orderNumber: 1,
            sellerStore: "Lacoste",
            shippingAddress: "Calle 123",
            shippingCity: "Arauca",
            shippingCountry: "Colombia",
            shippingMethod: 1,
            shippingRegion: "Arauca",
            items: [{
                productName: "Tomate de arbol",
                productQuantity: 2,
                productWeight: 5
            }]
        }
        stub(validations, "dayValidation").returns(false);
        const result = await createSellOrderService.createSellOrder(sellOrder);
        expect(result.shipPromiseMax).toBe(null);
        expect(result.packPromiseMin).toBe(null);
        expect(result.packPromiseMax).toBe(null);
        expect(result.deliveryPromiseMin).toBe(null);
        expect(result.deliveryPromiseMax).toBe(null);
        expect(result.readyPickupPromiseMin).toBe(null);
        expect(result.readyPickupPromiseMax).toBe(null);
    });
});
