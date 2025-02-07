import React from "react";
import StaffList from "../components/StaffList";
const Staffs = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang nhà cung cấp</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            <StaffList />
        </div>
    );
};

export default Staffs;
