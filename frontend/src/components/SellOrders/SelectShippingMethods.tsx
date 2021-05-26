import React, { useCallback, useEffect, useState } from 'react'
import { ShippingMethodsService } from '../../services/shipping-methods'

interface ShippingMethod {
    id: number,
    name: string
}

export const SelectShippingMethods: React.FC<{ onSelect(id: number): void }> = ({ onSelect }) => {

    const [shippingMethod, setShippingMethod] = useState<ShippingMethod[]>([]);

    const getShippingMethods = useCallback(async () => {
        const result = await ShippingMethodsService.getShippingMethods();
        if (result && result.length > 0) {
            setShippingMethod(result);
            onSelect(result[0].id)
        }
    }, [onSelect, setShippingMethod]);

    useEffect(() => {
        getShippingMethods();
    }, []);

    return <select onChange={(e) => onSelect(parseInt(e.target.value))} name="shippingMethod" className="form-select">
        {shippingMethod.map((sm, k) => {
            return <option key={k} value={sm.id}>{sm.name}</option>
        })}
    </select>;
}
