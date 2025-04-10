import React, { useState, useEffect } from 'react';
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
                } else if (filterType === 'year') {
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
            const year = parseInt(e.target.value);
            setSelectedDate(new Date(year, 0, 1));
        } else {
            setSelectedDate(new Date(e.target.value));
        }
    };

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        switch (filterType) {
            case 'day':
                return `${day}/${month}/${year}`;
            case 'month':
                return `${month}/${year}`;
            case 'year':
                return year.toString();
            default:
                return `${day}/${month}/${year}`;
        }
    };

    return (
        <div className="card bg-base-100 w-96 shadow-lg p-4">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Số lượng đơn hàng</h2>
                </div>
                <div className="flex gap-2 items-center">
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        className="select select-primary select-bordered select-sm w-44"
                    >
                        <option value="day">Theo ngày</option>
                        <option value="month">Theo tháng</option>
                        <option value="year">Theo năm</option>
                    </select>
                    {filterType === 'day' && (
                        <input
                            type="date"
                            className="input input-primary input-sm flex-1"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={handleDateChange}
                        />
                    )}
                    {filterType === 'month' && (
                        <input
                            type="month"
                            className="input input-primary input-sm flex-1"
                            value={selectedDate.toISOString().slice(0, 7)}
                            onChange={handleDateChange}
                        />
                    )}
                    {filterType === 'year' && (
                        <input
                            type="number"
                            className="input input-primary input-sm flex-1"
                            value={selectedDate.getFullYear()}
                            onChange={handleDateChange}
                            min="2000"
                            max="2100"
                        />
                    )}
                </div>
            </div>
            <p className="text-4xl font-bold text-primary">{orderCount}</p>
        </div>
    );
};

export default OrderCount;