import { Item } from "./Item";

export interface SellOrder {
    sellerStore: string;
    orderNumber: string;
    shippingMethod: string;
    buyerFullName: string;
    buyerPhone: string;
    buyerEmail: string;
    shippingAddress: string;
    shippingCity: string;
    shippingRegion: string;
    shippingCountry: string;
}