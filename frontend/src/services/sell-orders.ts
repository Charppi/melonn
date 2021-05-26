import { SellOrder } from "../components/SellOrders/models/SellOrder";
import { loader, showMessage } from "../utils";

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
            loader.close();
            const response = await result.json();
            if (result.status.toString().startsWith("2")) {
                showMessage("success", "Sell order created successfully");
            } else {
                let message = ``
                response.message.forEach((msg: string) => {
                    message += `${msg}\n`
                });
                await showMessage("error", message);
            }
            return response
        } catch (error) {
            showMessage("error", "An error has happened getting the sell orders");
        }
    }
    static async getSellOrders(limit = 10, offset = 0) {
        loader.open()
        try {
            const result = await fetch(`http://localhost:3000/api/sell-order?limit=${limit}&offset=${offset}`, { headers });
            loader.close()
            return await result.json();
        } catch (error) {
            showMessage("error", "An error has happened getting the sell orders")
        }
    }
    static async getSellOrder(internalNumber: string) {
        loader.open()
        try {
            const result = await fetch(`http://localhost:3000/api/sell-order/${internalNumber}`, { headers });
            loader.close()
            if (result.status === 404) {
                return null
            }
            return await result.json();
        } catch (error) {
            showMessage("error", "An error has happened getting the sell orders")
        }
    }
}