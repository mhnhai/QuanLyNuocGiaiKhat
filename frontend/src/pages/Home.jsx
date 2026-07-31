import React from "react";
import PageHeader from "../components/PageHeader";
import Dashboard from "../components/Dashboard/Dashboard";

const Home = () => {
    const today = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div>
            <PageHeader
                title="Tổng quan"
                subtitle={today}
            />
            <Dashboard />
        </div>
    );
};

export default Home;
