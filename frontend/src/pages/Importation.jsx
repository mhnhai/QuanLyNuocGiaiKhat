import React from "react";
import PageHeader from "../components/PageHeader";
import ImportationList from "../components/Importation/ImportationList";

const Importation = () => (
    <div>
        <PageHeader title="Nhập hàng" subtitle="Quản lý phiếu nhập và tồn kho" />
        <ImportationList />
    </div>
);

export default Importation;
