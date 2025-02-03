import React, { useState, useEffect } from "react";
import OrderService from "../services/order.service";
import OrderForm from "./OrderForm";
import Modal from "react-modal";

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
            <button onClick={() => toggleModal()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add Order</button>
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
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Customer ID</th>
                        <th className="py-2 px-4 border-b">Staff ID</th>
                        <th className="py-2 px-4 border-b">Order Date</th>
                        <th className="py-2 px-4 border-b">Shipping Date</th>
                        <th className="py-2 px-4 border-b">Form of Payment</th>
                        <th className="py-2 px-4 border-b">Total Price</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td className="py-2 px-4 border-b">{order._id}</td>
                            <td className="py-2 px-4 border-b">{order.id_customer}</td>
                            <td className="py-2 px-4 border-b">{order.id_staff}</td>
                            <td className="py-2 px-4 border-b">{order.order_date}</td>
                            <td className="py-2 px-4 border-b">{order.shipping_date}</td>
                            <td className="py-2 px-4 border-b">{order.form_payment}</td>
                            <td className="py-2 px-4 border-b">{order.total_price}</td>
                            <td className="py-2 px-4 border-b">{order.status}</td>
                            <td className="py-2 px-4 border-b">
                                <button onClick={() => toggleModal(order)} className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit</button>
                                <button onClick={() => handleDelete(order._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OrderList;