import React from "react";
import OrderList from "../components/OrderList";
const Orders = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang đơn hàng</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            <OrderList />
        </div>
    );
};

export default Orders;
