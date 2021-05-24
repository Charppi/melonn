import React, { useState } from 'react'
import { showMessage } from '../../utils';
import { FormGroup } from '../shared/FormGroup'
import { Item } from './models/Item'


export const FormCreateItem: React.FC<{ onAddItem(item: Item): void }> = ({ onAddItem }) => {
    const initialState = { productWeight: "", productQuantity: 0, productName: "" }
    const [item, setItem] = useState<Item>(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem({ ...item, [e.target.name]: e.target.value.trim() });
    }

    const validateItem = () => {
        if (item.productName.length === 0) return showMessage("error", "Please fill the product name field");
        if (item.productWeight.length === 0) return showMessage("error", "Please fill the product weight field");
        if (item.productQuantity <= 0) return showMessage("error", "Please insert a valid product quantity");
        item.productQuantity = Number(item.productQuantity)
        onAddItem(item);
    }

    return <div className="row">
        <h3>Add Products</h3>
        <span className="text-info">
            <i className="bi bi-info-circle"></i> -
            If you want to update a product quantity or weight, just write the name
        </span>
        <FormGroup label="Name">
            <input type="text" value={item.productName} onChange={handleChange} name="productName" className="form-control" />
        </FormGroup>
        <FormGroup label="Quantity">
            <input type="number" value={item.productQuantity} onChange={handleChange} name="productQuantity" className="form-control" />
        </FormGroup>
        <FormGroup label="Weight">
            <input type="text" value={item.productWeight} onChange={handleChange} name="productWeight" className="form-control" />
        </FormGroup>
        <FormGroup>
            <button onClick={validateItem} className="btn btn-outline-primary" type="button">Add</button>
        </FormGroup>
    </div>
}
