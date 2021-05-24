import React, { useState } from 'react'
import { FormCreateSellOrder } from '../components/SellOrders/FormCreateSellOrder';
import { Modal } from '../components/shared/Modal';

export const SellOrders: React.FC = () => {

    const [showModal, setShowModal] = useState(false);

    return <div className="row">
        <div className="col">
            <button type="button" className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Create Sale Order</button>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order number</th>
                            <th>Seller store</th>
                            <th>Creation date</th>
                            <th>Shipping method</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <Modal title="Create Sell Order" onClose={() => setShowModal(false)} show={showModal}>
                <FormCreateSellOrder />
            </Modal>
        </div>
    </div>
}
