import React from "react";
import PageHeader from "../components/PageHeader";
import SupplierList from "../components/Supplier/SupplierList";

const Suppliers = () => (
    <div>
        <PageHeader title="Nhà cung cấp" subtitle="Danh sách đối tác cung cấp sản phẩm" />
        <SupplierList />
    </div>
);

export default Suppliers;
