import { useFormik } from 'formik'
import React, { useState } from 'react'
import { FormGroup } from '../shared/FormGroup'
import { Hr } from '../shared/Hr'
import { ResetButton } from '../shared/ResetButton'
import { SubmitButton } from '../shared/SubmitButton'
import { FormCreateItem } from './FormCreateItem'
import { ItemsTable } from './ItemsTable'
import { Item } from './models/Item'
import { SellOrder } from './models/SellOrder'
import { SelectShippingMethods } from './SelectShippingMethods'
import * as Yup from 'yup'
import { confirmation, showMessage } from '../../utils'
import { SellOrdersService } from '../../services/sell-orders'

const yupString = Yup.string()

const REQUIRED_FIELD_MESSAGE = 'This field is required'

const validationSchema = Yup.object().shape({
    buyerEmail: yupString.email().required(REQUIRED_FIELD_MESSAGE),
    buyerFullName: yupString.required(REQUIRED_FIELD_MESSAGE),
    buyerPhone: yupString.required(REQUIRED_FIELD_MESSAGE),
    orderNumber: yupString.required(REQUIRED_FIELD_MESSAGE),
    sellerStore: yupString.required(REQUIRED_FIELD_MESSAGE),
    shippingAddress: yupString.required(REQUIRED_FIELD_MESSAGE),
    shippingCity: yupString.required(REQUIRED_FIELD_MESSAGE),
    shippingCountry: yupString.required(REQUIRED_FIELD_MESSAGE),
    shippingRegion: yupString.required(REQUIRED_FIELD_MESSAGE),
    shippingMethod: Yup.number()
})

export const FormCreateSellOrder: React.FC = () => {

    const [items, setItems] = useState<Item[]>([]);

    const initialValues = {
        buyerEmail: "",
        buyerFullName: "",
        buyerPhone: "",
        orderNumber: 0,
        sellerStore: "",
        shippingAddress: "",
        shippingCity: "",
        shippingCountry: "",
        shippingMethod: 1,
        shippingRegion: "",
        items
    }

    const onSubmit = async (values: SellOrder) => {
        if (items.length === 0) return showMessage("error", "Please ensure to add items to the sell order");
        const { value } = await confirmation(`Are you sure from create the sell order?`);
        if (value) {
            values.items = items
            SellOrdersService.createSellOrder(values)
        }
    }
    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    });

    const onAddItem = (item: Item) => {
        const alredyLoadedProduct = items.some(i => i.productName === item.productName);
        if (alredyLoadedProduct) {
            const itemIndex = items.findIndex(i => i.productName === item.productName);
            items[itemIndex] = item;
            setItems([...items]);
        } else {
            setItems([...items, item]);
        }
    }

    const onDeleteItem = (item: Item) => {
        setItems([...items.filter(i => i.productName !== item.productName)]);
    }

    return <form className="row" onSubmit={formik.handleSubmit}>
        <h3>Sell Information</h3>
        <FormGroup colMd="5" label="Seller Store">
            <input onChange={formik.handleChange} type="text" name="sellerStore" className="form-control" />
            {formik.touched.sellerStore && formik.errors.sellerStore && (
                <span className="text-danger">{formik.errors.sellerStore}</span>
            )}
        </FormGroup>
        <FormGroup colMd="3" label="Order Number">
            <input onChange={formik.handleChange} type="number" name="orderNumber" className="form-control" />
            {formik.touched.orderNumber && formik.errors.orderNumber && (
                <span className="text-danger">{formik.errors.orderNumber}</span>
            )}
        </FormGroup>
        <FormGroup colMd="4" label="Shipping Method">
            <SelectShippingMethods onSelect={(id) => {
                formik.setValues({ ...formik.values, shippingMethod: id })
            }} />
        </FormGroup>

        <FormGroup colMd="6" label="Buyer FullName">
            <input onChange={formik.handleChange} type="text" name="buyerFullName" className="form-control" />
            {formik.touched.buyerFullName && formik.errors.buyerFullName && (
                <span className="text-danger">{formik.errors.buyerFullName}</span>
            )}
        </FormGroup>

        <FormGroup colMd="3" label="Buyer Phone Number">
            <input onChange={formik.handleChange} type="text" name="buyerPhone" className="form-control" />
            {formik.touched.buyerPhone && formik.errors.buyerPhone && (
                <span className="text-danger">{formik.errors.buyerPhone}</span>
            )}
        </FormGroup>

        <FormGroup colMd="3" label="Buyer Email">
            <input onChange={formik.handleChange} type="email" name="buyerEmail" className="form-control" />
            {formik.touched.buyerEmail && formik.errors.buyerEmail && (
                <span className="text-danger">{formik.errors.buyerEmail}</span>
            )}
        </FormGroup>

        <FormGroup colMd="3" label="Shipping Addres">
            <input onChange={formik.handleChange} type="text" name="shippingAddress" className="form-control" />
            {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                <span className="text-danger">{formik.errors.shippingAddress}</span>
            )}
        </FormGroup>
        <FormGroup colMd="3" label="Shipping City">
            <input onChange={formik.handleChange} type="text" name="shippingCity" className="form-control" />
            {formik.touched.shippingCity && formik.errors.shippingCity && (
                <span className="text-danger">{formik.errors.shippingCity}</span>
            )}
        </FormGroup>

        <FormGroup colMd="3" label="Shipping Region">
            <input onChange={formik.handleChange} type="text" name="shippingRegion" className="form-control" />
            {formik.touched.shippingRegion && formik.errors.shippingRegion && (
                <span className="text-danger">{formik.errors.shippingRegion}</span>
            )}
        </FormGroup>

        <FormGroup colMd="3" label="Shipping Country">
            <input onChange={formik.handleChange} type="text" name="shippingCountry" className="form-control" />
            {formik.touched.shippingCountry && formik.errors.shippingCountry && (
                <span className="text-danger">{formik.errors.shippingCountry}</span>
            )}
        </FormGroup>

        <Hr />

        <FormGroup colMd="6">
            <FormCreateItem onAddItem={onAddItem} />
        </FormGroup>

        <FormGroup colMd="6">
            <ItemsTable items={items} onDeleteItem={onDeleteItem} />
        </FormGroup>
        <Hr />

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <SubmitButton />
            <ResetButton />
        </div>
    </form>
}
