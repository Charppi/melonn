import React from 'react'

export const OrderItem: React.FC = () => {
    return <tr>
        <td colSpan={2} width="20%">
            <input className="form-control" type="text" name="productName" placeholder="Name" />
        </td>
        <td colSpan={2} width="20%">
            <input className="form-control" type="number" name="productQuantity" placeholder="Quantity" />
        </td>
        <td colSpan={2} width="20%">
            <input className="form-control" type="text" name="productWeight" placeholder="Weight" />
        </td>
        <td>
            <button className="btn btn-danger">
                <i className="bi bi-x"></i>
            </button>
        </td>
    </tr>
}
