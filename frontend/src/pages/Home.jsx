import React from "react";
import Data from "../components/Data";
import Dashboard from "../components/Dashboard/Dashboard";
const Home = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang chủ</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            <Dashboard />
            <Data />

        </div>
    );
};

export default Home;
