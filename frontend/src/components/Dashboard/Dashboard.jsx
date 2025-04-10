import React from 'react';
import ProductCount from './ProductCount';
import CustomerCount from './CustomerCount';
import OrderCount from './OrderCount';
import DataChart from '../DataChart';

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
                <ProductCount/>
            </div>
            <div className="md:col-span-1">
                <CustomerCount/>
            </div>
            <div className="md:col-span-1">
                <OrderCount/>
            </div>
            <div className="md:col-span-3">
                <DataChart/>
            </div>

        </div>
    );
};

export default Dashboard;