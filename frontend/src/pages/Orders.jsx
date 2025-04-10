import React from "react";
import OrderList from "../components/Order/OrderList";
const Orders = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang đơn hàng</h1>
            <OrderList />
        </div>
    );
};

export default Orders;
