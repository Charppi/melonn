import React, { useEffect, useState } from 'react'
import { ShippingMethodsService } from '../../services/shipping-methods'

interface ShippingMethod {
    id: number,
    name: string
}

export const SelectShippingMethods: React.FC<{ onSelect(id: number): void }> = ({ onSelect }) => {

    const [shippingMethod, setShippingMethod] = useState<ShippingMethod[]>([])

    const getShippingMethods = async () => {
        const result = await ShippingMethodsService.getShippingMethods()
        setShippingMethod(result);
        onSelect(result[0])
    }

    useEffect(() => {
        getShippingMethods()
    }, [])

    return <select onChange={(e) => onSelect(parseInt(e.target.value))} name="shippingMethod" className="form-select">
        {shippingMethod.map((sm, k) => {
            return <option key={k} value={sm.id}>{sm.name}</option>
        })}
    </select>
}
