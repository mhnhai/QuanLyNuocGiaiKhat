import React, { useState, useEffect } from "react";
import OrderService from "../services/order.service";
import CustomerService from "../services/customer.service";
import OrderForm from "./OrderForm";
import Modal from "react-modal";
import formatDateTime from "../utils/formatDateTime";
import { Button, DeleteButton, EditButton } from "./Button";
import SearchBar from "./SearchBar";
import DateFilter from "./DateFilter";
import {FaEye, FaTrash} from "react-icons/fa";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [customerNames, setCustomerNames] = useState({});
    const [originalOrders, setOriginalOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await OrderService.getAll();
            setOrders(response.data);
            setOriginalOrders(response.data);
            fetchCustomerNames(response.data);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const fetchCustomerNames = async (orders) => {
        const names = {};
        for (const order of orders) {
            if (order.id_customer && !names[order.id_customer]) {
                try {
                    const response = await CustomerService.getById(order.id_customer);
                    names[order.id_customer] = response.data.name;
                } catch (error) {
                    console.error(`Error fetching customer with id ${order.id_customer}:`, error);
                }
            }
        }
        setCustomerNames(names);
    };

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

    const handleSearch = (searchTerm) => {
        if (searchTerm) {
            const filteredOrders = orders.filter(order =>
                customerNames[order.id_customer]?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setOrders(filteredOrders);
        } else {
            fetchOrders();
        }
    };

    const handleDateFilter = (date) => {
        if (date) {
            const filteredOrders = originalOrders.filter(order =>
                order.order_date.startsWith(date)
            );
            setOrders(filteredOrders);
        } else {
            setOrders(originalOrders);
        }
    };

    const modalStyles = {
        content: {
            width: '50%',
            height: '60%',
            margin: 'auto',
            padding: '20px',
        },
    };

    return (
        <div className="container pt-4">
            <h1 className="text-2xl font-bold mb-4">Order List</h1>
            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} className="flex-1"/>
                <div className="flex shadow-lg items-center space-x-2 bg-base-100 p-3 rounded-lg">
                    <span>Lọc theo ngày:</span>
                    <DateFilter onFilter={handleDateFilter}/>
                </div>
                <Button onClick={() => toggleModal()} className="flex-initial">Tạo đơn hàng</Button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <OrderForm order={selectedOrder} onSave={handleOrderSave} onClose={toggleModal}/>
                </div>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{maxHeight: '69vh'}}>
                    <div className="overflow-x-auto">
                        <table className="table bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border">Tên khách hàng</th>
                                <th className="py-2 px-4 border">Ngày đặt hàng</th>
                                <th className="py-2 px-4 border">Ngày giao hàng</th>
                                <th className="py-2 px-4 border">Tổng giá trị</th>
                                <th className="py-2 px-4 border">Trạng thái</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="py-2 px-4 border">{customerNames[order.id_customer]}</td>
                                    <td className="py-2 px-4 border">{formatDateTime(order.order_date)}</td>
                                    <td className="py-2 px-4 border">{formatDateTime(order.shipping_date)}</td>
                                    <td className="py-2 px-4 border">{order.total_price}</td>
                                    <td className="py-2 px-4 border">{order.status}</td>
                                    <td className="py-2 px-4 border">
                                        <div className="flex justify-center">
                                            <button onClick={() => toggleModal(order)}
                                                    className="btn btn-sm btn-outline btn-info">
                                                <FaEye/>
                                                Xem chi tiết
                                            </button>
                                            <button onClick={() => handleDelete(order._id)}
                                                    className="btn btn-sm btn-outline btn-error">
                                                <FaTrash/>
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
export default OrderList;