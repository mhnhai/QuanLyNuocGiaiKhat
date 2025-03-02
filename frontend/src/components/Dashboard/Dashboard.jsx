import React from 'react';
import ProductCount from './ProductCount';
import CustomerCount from './CustomerCount';
import OrderCount from './OrderCount'
// import RevenueSummary from './RevenueSummary';

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProductCount />
            <CustomerCount />
            <OrderCount />
            {/*<RevenueSummary />*/}
        </div>
    );
};

export default Dashboard;