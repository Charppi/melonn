import React from 'react'
import { Item } from './models/Item'

export const ItemsTable: React.FC<{ items: Item[], onDeleteItem(item: Item): void }> = ({ items, onDeleteItem }) => {
    return <table className="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Weight</th>
                <th>Quantity</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            {items.map((item, k) => {
                return <tr key={k + 1}>
                    <td>{item.productName}</td>
                    <td>{item.productWeight}</td>
                    <td>{item.productQuantity}</td>
                    <td>
                        <button type="button" onClick={() => onDeleteItem(item)} className="btn btn-danger btn-sm">
                            <i className="bi bi-x"></i>
                        </button>
                    </td>
                </tr>
            })}
        </tbody>
    </table>
}
