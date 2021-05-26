import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateOrderDto {

    @IsString()
    public sellerStore: string;

    @IsNumber()
    public orderNumber: number;

    @IsNumber()
    public shippingMethod: number;

    @IsString()
    public buyerFullName: string;

    @IsString()
    public buyerPhone: string;

    @IsEmail()
    public buyerEmail: string;

    @IsString()
    public shippingAddress: string;

    @IsString()
    public shippingCity: string;

    @IsString()
    public shippingRegion: string;

    @IsString()
    public shippingCountry: string;

    @IsArray()
    @Type(() => Item)
    @ValidateNested({ each: true })
    public items: Item[]

}

export class Item {

    @IsString()
    public productName: string;

    @IsNumber()
    public productQuantity: number;

    @IsNumber()
    public productWeight: number;

}