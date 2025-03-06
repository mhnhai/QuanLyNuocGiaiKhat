import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Importation from './pages/Importation';
import Staffs from './pages/Staffs';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';
import Login from './components/Login';
import withAdminAuth from './components/withAdminAuth';
import Logout from "./components/Logout";

const ProtectedHome = withAdminAuth(Home);
const ProtectedProducts = withAdminAuth(Products);
const ProtectedCustomers = withAdminAuth(Customers);
const ProtectedOrders = withAdminAuth(Orders);
const ProtectedImportation = withAdminAuth(Importation);
const ProtectedStaffs = withAdminAuth(Staffs);
const ProtectedSuppliers = withAdminAuth(Suppliers);
const ProtectedSettings = withAdminAuth(Settings);

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="flex">
                {isAuthenticated && <Sidebar />}
                <div className={`flex-1 p-6 bg-gray-100 ${isAuthenticated ? '' : 'w-full'}`}>
                    <Routes>
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                        <Route path="/" element={<ProtectedHome />} />
                        <Route path="/products" element={<ProtectedProducts />} />
                        <Route path="/customers" element={<ProtectedCustomers />} />
                        <Route path="/orders" element={<ProtectedOrders />} />
                        <Route path="/importations" element={<ProtectedImportation />} />
                        <Route path="/staffs" element={<ProtectedStaffs />} />
                        <Route path="/suppliers" element={<ProtectedSuppliers />} />
                        <Route path="/settings" element={<ProtectedSettings />} />
                        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App; 