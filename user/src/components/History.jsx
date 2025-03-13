import React, { useEffect, useState } from 'react';
import OrderService from "../services/order.service";
import productService from '../services/product.service';

const History = () => {
    const [orders, setOrders] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
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

        fetchOrders();
    }, [currentUser.id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
    
    if (error) return (
        <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error loading orders: {error.message}</span>
        </div>
    );

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center">Lịch sử đơn hàng</h1>
            {orders.length === 0 ? (
                <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>No orders found for this customer.</span>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <h2 className="card-title">Đơn hàng #{order._id}</h2>
                                    <div className={`badge ${
                                        order.status === 'Đã giao' ? 'badge-success' :
                                        order.status === 'Đang giao' ? 'badge-warning' :
                                        'badge-info'
                                    } badge-lg`}>
                                        {order.status}
                                    </div>
                                </div>
                                <div className="divider"></div>
                                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="font-semibold">Ngày đặt</p>
                                        <p>{new Date(order.order_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Ngày giao</p>
                                        <p>{new Date(order.shipping_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Tổng cộng</p>
                                        <p className="text-primary font-bold">{order.total_price} VND</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {order.order_items.map(item => (
                                        <div key={item.id_product} className="bg-base-200 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold">{productNames[item.id_product] || 'Loading...'}</h3>
                                                    <p className="text-sm opacity-70">Số lượng: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary">${item.selling_price}</p>
                                                    <p className="text-sm opacity-70">Per Unit</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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