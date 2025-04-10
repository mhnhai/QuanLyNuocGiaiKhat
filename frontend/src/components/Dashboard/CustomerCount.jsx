import React, { useState, useEffect } from 'react';
import customerService from '../../services/customer.service';

const CustomerCount = () => {
    const [customerCount, setCustomerCount] = useState(0);

    useEffect(() => {
        const fetchCustomerCount = async () => {
            try {
                const count = await customerService.getCustomerCount();
                setCustomerCount(count.total_customers);
            } catch (error) {
                console.error('Error fetching customer count:', error);
            }
        };

        fetchCustomerCount();
    }, []);

    return (
        <div className="card bg-base-100 shadow-lg p-6 h-full">
            <div className="flex flex-col justify-between h-full">
                <h2 className="text-xl font-bold text-gray-800">Số lượng khách hàng</h2>
                <p className="text-4xl font-bold text-primary">{customerCount}</p>
            </div>
        </div>
    );
};

export default CustomerCount;