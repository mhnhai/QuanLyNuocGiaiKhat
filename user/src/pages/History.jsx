import React, { useEffect, useState } from 'react';
import OrderService from "../services/order.service";
import productService from '../services/product.service';
import { FaTrash } from "react-icons/fa";
import formatDateTime from '../utils/formatDateTime';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const [orders, setOrders] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { user: currentUser } = useAuth();

    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'Chưa xác nhận', label: 'Chưa xác nhận' },
        { value: 'Đã xác nhận', label: 'Đã xác nhận' },
        { value: 'Đang giao', label: 'Đang giao' },
        { value: 'Đã giao', label: 'Đã giao' },
        { value: 'Đã hủy', label: 'Đã hủy' }
    ];

    useEffect(() => {
        if (currentUser?.id) {
            fetchOrders();
        }
    }, [currentUser?.id]);

    const fetchOrders = async () => {
        try {
            const response = await OrderService.getOrderByCustomer(currentUser.id);
            setOrders(response.data);

            // Fetch product names
            const productIds = response.data.flatMap(order => order.order_items.map(item => item.id_product));
            const uniqueProductIds = [...new Set(productIds)];
            const productNamesMap = {};

            for (const id of uniqueProductIds) {
                const productResponse = await productService.getProductName(id);
                productNamesMap[id] = productResponse.data.name;
            }

            setProductNames(productNamesMap);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            try {
                await OrderService.cancelOrder(orderId);
                setOrders(orders.map(order =>
                    order._id === orderId
                        ? { ...order, status: 'Đã hủy' }
                        : order
                ));
            } catch (error) {
                console.error('Error canceling order:', error);
                const message = error.response?.data?.detail || 'Không thể hủy đơn hàng';
                alert(message);
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.order_date);
        const localDate = new Date(orderDate.getTime() - orderDate.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];

        const matchesDate = !dateFilter || localDate === dateFilter;
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesDate && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-error">
                    <span>Đã xảy ra lỗi khi tải lịch sử đơn hàng.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Lịch sử đơn hàng</h2>
                <div className="text-sm breadcrumbs justify-center">
                    <ul>
                        <li>Trang chủ</li>
                        <li>Lịch sử đơn hàng</li>
                    </ul>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="w-64">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                    <div className="alert alert-info">
                        <span>Không tìm thấy đơn hàng nào.</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="card-title">Đơn hàng #{order._id.slice(-6)}</h3>
                                        <p className="text-sm opacity-75">
                                            Ngày đặt: {formatDateTime(order.order_date)}
                                        </p>
                                        {order.shipping_date && (
                                            <p className="text-sm opacity-75">
                                                Ngày giao: {formatDateTime(order.shipping_date)}
                                            </p>
                                        )}
                                        {!order.shipping_date && (
                                            <p className="text-sm opacity-75">
                                                Ngày nhận: Chưa giao hàng
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`badge ${order.status === 'Đã xác nhận' ? 'badge-success' :
                                            order.status === 'Đang giao' ? 'badge-warning' :
                                                order.status === 'Đã giao' ? 'badge-info' :
                                                    order.status === 'Đã hủy' ? 'badge-error' :
                                                        'badge-ghost'
                                            }`}>
                                            {order.status}
                                        </div>
                                        {order.status === 'Chưa xác nhận' && (
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() => handleCancelOrder(order._id)}
                                            >
                                                <FaTrash className="mr-2" />
                                                Hủy đơn
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="divider my-2"></div>

                                <div className="space-y-4">
                                    {order.order_items.map(item => (
                                        <div key={item.id_product} className="bg-base-200 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold">{productNames[item.id_product] || 'Loading...'}</h3>
                                                    <p className="text-sm opacity-70">Số lượng: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary">{item.selling_price.toLocaleString()} VND</p>
                                                    <p className="text-sm opacity-70">Per Unit</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="divider my-2"></div>

                                <div className="flex justify-around items-center">
                                    <div className="text-sm opacity-75">
                                        Phương thức thanh toán: {order.form_payment}
                                    </div>
                                    <div className="text-lg font-bold">
                                        Tổng tiền: {order.total_price.toLocaleString()} VND
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;