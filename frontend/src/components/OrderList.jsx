import React, { useState, useEffect } from "react";
import OrderService from "../services/order.service";
import OrderForm from "./OrderForm";
import Modal from "react-modal";
import formatDateTime from "../utils/formatDateTime";
import {Button, DeleteButton, EditButton} from "./Button";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        OrderService.getAll()
            .then((response) => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await OrderService.delete(id);
            setOrders(orders.filter((order) => order._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleModal = (order = null) => {
        setSelectedOrder(order);
        setModalIsOpen(!modalIsOpen);
    };

    const handleOrderSave = (savedOrder) => {
        setOrders((prevOrders) => {
            const existingOrderIndex = prevOrders.findIndex(order => order._id === savedOrder._id);
            if (existingOrderIndex !== -1) {
                const updatedOrders = [...prevOrders];
                updatedOrders[existingOrderIndex] = savedOrder;
                return updatedOrders;
            } else {
                return [...prevOrders, savedOrder];
            }
        });
        toggleModal();
    };

    const modalStyles = {
        content: {
            width: '50%', // Adjust the width as needed
            height: '80%', // Adjust the height as needed
            margin: 'auto', // Center the modal
            padding: '20px', // Add padding if needed
        },
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order List</h1>
            <Button onClick={() => toggleModal()} className="flex-initial">Tạo đơn hàng</Button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <OrderForm order={selectedOrder} onSave={handleOrderSave} />
                    <button onClick={toggleModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Close</button>
                </div>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{maxHeight: '72vh'}}>
                    <table className="min-w-full bg-white">
                        <thead className="sticky top-0 bg-gray-400">
                        <tr>
                            <th className="py-2 px-4 border">Customer</th>
                            <th className="py-2 px-4 border">Staff</th>
                            <th className="py-2 px-4 border">Order Date</th>
                            <th className="py-2 px-4 border">Shipping Date</th>
                            <th className="py-2 px-4 border">Form of Payment</th>
                            <th className="py-2 px-4 border">Total Price</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="py-2 px-4 border">{order.id_customer}</td>
                                <td className="py-2 px-4 border">{order.id_staff}</td>
                                <td className="py-2 px-4 border">{formatDateTime(order.order_date)}</td>
                                <td className="py-2 px-4 border">{formatDateTime(order.shipping_date)}</td>
                                <td className="py-2 px-4 border">{order.form_payment}</td>
                                <td className="py-2 px-4 border">{order.total_price}</td>
                                <td className="py-2 px-4 border">{order.status}</td>
                                <td className="py-2 px-4 border">
                                    <EditButton onClick={() => toggleModal(order)}
                                            >Edit
                                    </EditButton>
                                    <DeleteButton onClick={() => handleDelete(order._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete
                                    </DeleteButton>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            )}
        </div>
    );
}

export default OrderList;