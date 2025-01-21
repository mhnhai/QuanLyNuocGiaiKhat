import React from "react";
import AccountForm from "../components/AccountForm"

const Customers = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang khách hàng</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            <AccountForm />
        </div>
    );
};

export default Customers;
