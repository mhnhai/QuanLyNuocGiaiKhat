import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import orderService from '../../services/order.service';

const OrderCount = () => {
    const [orderCount, setOrderCount] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterType, setFilterType] = useState('day');

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                let year, month, day;

                if (filterType === 'day') {
                    year = selectedDate.getFullYear();
                    month = selectedDate.getMonth() + 1;
                    day = selectedDate.getDate();
                } else if (filterType === 'month') {
                    const [yearStr, monthStr] = selectedDate.toISOString().split('-');
                    year = parseInt(yearStr);
                    month = parseInt(monthStr);
                    day = null;
                } else {
                    year = selectedDate.getFullYear();
                    month = null;
                    day = null;
                }

                const count = await orderService.getOrderCount(year, month, day);
                setOrderCount(count.data.total_orders);
            } catch (error) {
                console.error('Error fetching order count:', error);
            }
        };

        fetchOrderCount();
    }, [selectedDate, filterType]);

    const handleDateChange = (e) => {
        if (filterType === 'year') {
            setSelectedDate(new Date(parseInt(e.target.value), 0, 1));
        } else {
            setSelectedDate(new Date(e.target.value));
        }
    };

    return (
        <div className="card bg-base-100 shadow-md border border-base-300 h-full hover:shadow-lg transition-shadow">
            <div className="card-body gap-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-base-content/60 font-medium">Đơn hàng</p>
                        <p className="text-4xl font-bold text-accent mt-2">{orderCount}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-accent/10 text-accent">
                        <FaShoppingCart className="text-2xl" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-base-300">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="select select-bordered select-sm flex-1 min-w-[7rem]"
                    >
                        <option value="day">Theo ngày</option>
                        <option value="month">Theo tháng</option>
                        <option value="year">Theo năm</option>
                    </select>
                    {filterType === 'day' && (
                        <input
                            type="date"
                            className="input input-bordered input-sm flex-1"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={handleDateChange}
                        />
                    )}
                    {filterType === 'month' && (
                        <input
                            type="month"
                            className="input input-bordered input-sm flex-1"
                            value={selectedDate.toISOString().slice(0, 7)}
                            onChange={handleDateChange}
                        />
                    )}
                    {filterType === 'year' && (
                        <input
                            type="number"
                            className="input input-bordered input-sm flex-1"
                            value={selectedDate.getFullYear()}
                            onChange={handleDateChange}
                            min="2000"
                            max="2100"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCount;
