import React from "react";
import Revenue from "../components/Revenue";
const Home = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang chủ</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán bia!</p>
            <Revenue />
        </div>
    );
};

export default Home;
