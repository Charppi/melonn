import { IsEmail, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateOrderDto {

    @IsString()
    sellerStore: string;

    @IsString()
    orderNumber: number;

    @IsNumber()
    shippingMethod: number;

    @IsString()
    buyerFullName: string;

    @IsString()
    buyerPhone: string;

    @IsEmail()
    buyerEmail: string;

    @IsString()
    shippingAddress: string;

    @IsString()
    shippingCity: string;

    @IsString()
    shippingRegion: string;

    @IsString()
    shippingCountry: string;

    @ValidateNested()
    items: Item[]

    creationDate?: string
    internalOrderNumber?: string
    packPromiseMin?: string
    packPromiseMax?: string
    shipPromiseMin?: string
    shipPromiseMax?: string
    deliveryPromiseMin?: string
    deliveryPromiseMax?: string
    readyPickupPromiseMin?: string
    readyPickupPromiseMax?: string
}

export class Item {

    @IsString()
    productName: string;

    @IsNumber()
    productQuantity: number;

    @IsNumber()
    productWeight: number;

}