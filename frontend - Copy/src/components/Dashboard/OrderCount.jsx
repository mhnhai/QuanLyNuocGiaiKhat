import React, { useState, useEffect } from 'react';
import orderService from '../../services/order.service';

const OrderCount = () => {
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                const count = await orderService.getOrderCount();
                setOrderCount(count.total_orders);
            } catch (error) {
                console.error('Error fetching order count:', error);
            }
        };

        fetchOrderCount();
    }, []);

    return (
        <div className="card bg-base-100 w-96 shadow-lg p-4">
            <h2 className="text-xl font-bold">Số lượng đơn hàng</h2>
            <p className="text-2xl">{orderCount}</p>
        </div>
    );
};

export default OrderCount;