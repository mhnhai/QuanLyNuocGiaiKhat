import React from "react";
import AccountList from "../components/AccountList"
import CustomerList from "../components/CustomerList";
const Customers = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang khách hàng</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            {/*<AccountList />*/}
            <CustomerList />
        </div>
    );
};

export default Customers;
