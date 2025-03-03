import React from "react";
import Dashboard from "../components/Dashboard/Dashboard";
const Home = () => {
    return (
        <div className="overflow-auto" style={{maxHeight: '94vh'}}>
            <h1 className="text-3xl font-bold">Trang chủ</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            <Dashboard />
        </div>
    );
};

export default Home;
