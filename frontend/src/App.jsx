import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './components/AdminLayout';
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

const AuthenticatedRoute = ({ children }) => (
    <AdminLayout>{children}</AdminLayout>
);

const wrap = (Component) => (
    <AuthenticatedRoute>
        <Component />
    </AuthenticatedRoute>
);

const AppRoutes = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/" element={wrap(ProtectedHome)} />
            <Route path="/products" element={wrap(ProtectedProducts)} />
            <Route path="/customers" element={wrap(ProtectedCustomers)} />
            <Route path="/orders" element={wrap(ProtectedOrders)} />
            <Route path="/importations" element={wrap(ProtectedImportation)} />
            <Route path="/staffs" element={wrap(ProtectedStaffs)} />
            <Route path="/suppliers" element={wrap(ProtectedSuppliers)} />
            <Route path="/settings" element={wrap(ProtectedSettings)} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App = () => (
    <ThemeProvider>
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    </ThemeProvider>
);

export default App;
