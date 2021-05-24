import { SellOrder } from "../components/SellOrders/models/SellOrder";
import { loader } from "../utils";

export const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

export class SellOrdersService {
    static async createSellOrder(order: SellOrder) {
        loader.open()
        try {
            const result = await fetch(`http://localhost:3000/api/sell-order`, {
                method: "POST",
                body: JSON.stringify(order),
                headers
            });
            const response = await result.json();
            console.log(response);
        } catch (error) {
            console.log(error);

        }
    }
}