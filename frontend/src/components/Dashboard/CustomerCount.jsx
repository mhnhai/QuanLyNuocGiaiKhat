import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
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
        <div className="card bg-base-100 shadow-md border border-base-300 h-full hover:shadow-lg transition-shadow">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-base-content/60 font-medium">Khách hàng</p>
                        <p className="text-4xl font-bold text-secondary mt-2">{customerCount}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                        <FaUsers className="text-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerCount;
