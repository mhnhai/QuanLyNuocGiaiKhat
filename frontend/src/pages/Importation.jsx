import React from "react";
import ImportationList from "../components/ImportationList";
const Importation = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang nhập hàng</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            <ImportationList />
        </div>
    );
};

export default Importation;
