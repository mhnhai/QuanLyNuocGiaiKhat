import React from "react";
import Dashboard from "../components/Dashboard/Dashboard";
const Home = () => {
    return (
        <div className="overflow-auto" style={{maxHeight: '92vh'}}>
            <h1 className="text-3xl font-bold mb-3">Trang chủ</h1>
            <Dashboard />
        </div>
    );
};

export default Home;
