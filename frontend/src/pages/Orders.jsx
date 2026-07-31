import React from "react";
import PageHeader from "../components/PageHeader";
import OrderList from "../components/Order/OrderList";

const Orders = () => (
    <div>
        <PageHeader title="Đơn hàng" subtitle="Theo dõi và cập nhật trạng thái đơn hàng" />
        <OrderList />
    </div>
);

export default Orders;
