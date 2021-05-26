import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { ResponseSellOrder } from '../components/SellOrders/models/SellOrder';
import { FormGroup } from '../components/shared/FormGroup';
import { SellOrdersService } from '../services/sell-orders';
import image404 from "../assets/404.svg"

export const Details: React.FC = () => {
    let { internalOrderNumber } = useParams<{ internalOrderNumber: string }>();
    const [sellOrder, setSellOrder] = useState<ResponseSellOrder | null>();

    const getSellOrder = async () => {
        if (internalOrderNumber) {
            const sellOrder = await SellOrdersService.getSellOrder(internalOrderNumber);
            console.log(sellOrder);

            setSellOrder(sellOrder);
        }
    }

    useEffect(() => {
        getSellOrder()
    }, [internalOrderNumber])

    return sellOrder ? <div className="row">
        <div className="col-md-6">
            <h2>Order Information</h2>
            <FormGroup colMd="12" label="External order number">
                <input className="form-control" readOnly={true} value={sellOrder?.orderNumber} />
            </FormGroup>
            <FormGroup colMd="12" label="Buyer Full Name">
                <input className="form-control" readOnly={true} value={sellOrder?.buyerFullName} />
            </FormGroup>
            <FormGroup colMd="12" label="Buyer Phone Number">
                <input className="form-control" readOnly={true} value={sellOrder?.buyerPhone} />
            </FormGroup>
            <FormGroup colMd="12" label="Buyer Email">
                <input className="form-control" readOnly={true} value={sellOrder?.buyerEmail} />
            </FormGroup>
        </div>

        <div className="col-md-6">
            <h2>Shipping Information</h2>
            <FormGroup colMd="12" label="Shipping Address">
                <input className="form-control" readOnly={true} value={sellOrder?.shippingAddress} />
            </FormGroup>
            <FormGroup colMd="12" label="Shipping City">
                <input className="form-control" readOnly={true} value={sellOrder?.shippingCity} />
            </FormGroup>
            <FormGroup colMd="12" label="Shipping Region">
                <input className="form-control" readOnly={true} value={sellOrder?.shippingRegion} />
            </FormGroup>
            <FormGroup colMd="12" label="Shipping Country">
                <input className="form-control" readOnly={true} value={sellOrder?.shippingCountry} />
            </FormGroup>
        </div>

        <div className="col-md-6">
            <h2>Promises Dates</h2>
            <FormGroup colMd="12" label="Pack promise min">
                <input className="form-control" readOnly={true} value={sellOrder?.packPromiseMin || "N/A"} />
            </FormGroup>
            <FormGroup colMd="12" label="Pack promise max">
                <input className="form-control" readOnly={true} value={sellOrder?.packPromiseMax || "N/A"} />
            </FormGroup>
            <FormGroup colMd="12" label="Ship promise min">
                <input className="form-control" readOnly={true} value={sellOrder?.shipPromiseMin || "N/A"} />
            </FormGroup>
            <FormGroup colMd="12" label="Ship promise min">
                <input className="form-control" readOnly={true} value={sellOrder?.shipPromiseMax || "N/A"} />
            </FormGroup>
            <FormGroup colMd="12" label="Delivery promise min">
                <input className="form-control" readOnly={true} value={sellOrder?.deliveryPromiseMin || "N/A"} />
            </FormGroup>
            <FormGroup colMd="12" label="Delivery promise min">
                <input className="form-control" readOnly={true} value={sellOrder?.deliveryPromiseMax || "N/A"} />
            </FormGroup>
            <FormGroup colMd="12" label="Ready pickup promise min">
                <input className="form-control" readOnly={true} value={sellOrder?.readyPickupPromiseMin || "N/A"} />
            </FormGroup>
            <FormGroup colMd="12" label="Ready pickup promise min">
                <input className="form-control" readOnly={true} value={sellOrder?.readyPickupPromiseMax || "N/A"} />
            </FormGroup>
        </div>
        <div className="col-md-6">
            <h2>Line Items</h2>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellOrder?.items?.map((item, k) => {
                            return <tr key={k}>
                                <td>{item.productName}</td>
                                <td>{item.productQuantity}</td>
                                <td>{item.productWeight}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div> : <div className="row justify-content-center">
        <div className="col-md-5 text-center">
            <img src={image404} alt="404" />
            <h2>Ups, seems that the internal code does not match with the created sell orders internal codes</h2>
        </div>
    </div>
}
