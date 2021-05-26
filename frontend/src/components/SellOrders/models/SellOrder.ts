import { Item } from "./Item";

export class SellOrder {
    sellerStore!: string;
    orderNumber!: number;
    shippingMethod!: number;
    buyerFullName!: string;
    buyerPhone!: string;
    buyerEmail!: string;
    shippingAddress!: string;
    shippingCity!: string;
    shippingRegion!: string;
    shippingCountry!: string;
    items?: Item[]
}

export class ResponseSellOrder extends SellOrder {
    creationDate!: string
    internalOrderNumber!: string
    packPromiseMin!: string | null
    packPromiseMax!: string | null
    shipPromiseMin!: string | null
    shipPromiseMax!: string | null
    deliveryPromiseMin!: string | null
    deliveryPromiseMax!: string | null
    readyPickupPromiseMin!: string | null
    readyPickupPromiseMax!: string | null
    shippingMethodName!: string
}
