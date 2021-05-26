import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FormCreateSellOrder } from '../components/SellOrders/FormCreateSellOrder';
import { ResponseSellOrder } from '../components/SellOrders/models/SellOrder';
import { Modal } from '../components/shared/Modal';
import { Pagination } from '../components/shared/Pagination';
import { SellOrdersService } from '../services/sell-orders';

export const SellOrders: React.FC = () => {

    const [showModal, setShowModal] = useState(false);
    const [sellOrders, setSellOrders] = useState<ResponseSellOrder[]>([]);
    const [totalOrders, setTotalOrders] = useState(0)

    const gerSellOrders = async (limit: number, offset: number) => {
        const { response, total } = await SellOrdersService.getSellOrders(limit, offset);
        setTotalOrders(total)
        setSellOrders(response)
    }

    useEffect(() => { gerSellOrders(10, 0) }, []);

    return <div className="row">
        <div className="col">
            <button type="button" className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Create Sale Order</button>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Pagination total={totalOrders} onChangePage={(i) => {
                    gerSellOrders(10, Number(`${i}0`))
                }} />
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Internal number orden</th>
                            <th>Order number</th>
                            <th>Seller store</th>
                            <th>Creation date</th>
                            <th>Shipping method</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sellOrders.map((sellOrder, k) => {
                                return <tr key={k}>
                                    <td>{sellOrder.internalOrderNumber}</td>
                                    <td>{sellOrder.orderNumber}</td>
                                    <td>{sellOrder.sellerStore}</td>
                                    <td>{sellOrder.creationDate}</td>
                                    <td>{sellOrder.shippingMethodName}</td>
                                    <td>
                                        <Link to={`/${sellOrder.internalOrderNumber}`} className="btn btn-info btn-sm">Details</Link>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <Modal title="Create Sell Order" onClose={() => setShowModal(false)} show={showModal}>
                <FormCreateSellOrder />
            </Modal>
        </div>
    </div>
}
