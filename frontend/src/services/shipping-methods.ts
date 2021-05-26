import { showMessage } from '../utils';
import { headers } from './sell-orders'

export class ShippingMethodsService {
    static async getShippingMethods() {
        try {
            const result = await fetch(`http://localhost:3000/api/shipping-method`, {
                headers
            });
            return await result.json();
        } catch (error) {
            showMessage("error", "An error has happened getting the shipping methods.")
        }
    }
}