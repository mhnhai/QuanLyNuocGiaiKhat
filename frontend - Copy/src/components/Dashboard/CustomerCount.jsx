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
        <div className="card bg-base-100 w-96 shadow-lg p-4">
            <h2 className="text-xl font-bold">Số lượng khách hàng</h2>
            <p className="text-2xl">{customerCount}</p>
        </div>
    );
};

export default CustomerCount;