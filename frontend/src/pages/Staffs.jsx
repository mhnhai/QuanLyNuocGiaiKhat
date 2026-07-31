import React from "react";
import PageHeader from "../components/PageHeader";
import StaffList from "../components/Staff/StaffList";

const Staffs = () => (
    <div>
        <PageHeader title="Nhân viên" subtitle="Quản lý tài khoản và phân quyền nhân viên" />
        <StaffList />
    </div>
);

export default Staffs;
