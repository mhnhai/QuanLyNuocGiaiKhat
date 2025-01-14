import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ProductManagement from "./pages/ProductManagement";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";

const App = () => {
    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6 bg-gray-100">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/beers" element={<ProductManagement />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
