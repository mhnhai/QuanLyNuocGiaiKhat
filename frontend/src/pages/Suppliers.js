import React from "react";
import SupplierForm from "../components/SupplierForm";
import SupplierList from "../components/SupplierList";
const Customers = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang nhà cung cấp</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            <SupplierForm />
            <SupplierList />
        </div>
    );
};

export default Customers;
