import React from "react";
import PageHeader from "../components/PageHeader";
import CustomerList from "../components/Customer/CustomerList";

const Customers = () => (
    <div>
        <PageHeader title="Khách hàng" subtitle="Quản lý tài khoản và thông tin khách hàng" />
        <CustomerList />
    </div>
);

export default Customers;
