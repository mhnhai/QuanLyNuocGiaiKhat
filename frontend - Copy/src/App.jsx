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
import Navbar from "./components/Navbar"

const App = () => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

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
                {/*{isAuthenticated && <Sidebar/>}*/}
                <Navbar/>
                <div className={`flex-1 p-6 bg-gray-100 ${isAuthenticated ? '' : 'w-full'}`}>
                    <Routes>
                        <Route path="/login"
                               element={isAuthenticated ? <Navigate to="/"/> : <Login onLogin={handleLogin}/>}/>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/products" element={<Products/>}/>
                        <Route path="/customers" element={<Customers/>}/>
                        <Route path="/logout" element={<Logout onLogout={handleLogout}/>}/>
                    </Routes>
                </div>
            </div>
            <div className="p-10">
                <h1 className="text-3xl font-bold">Theme Switcher</h1>
                <button className="btn btn-primary mt-4" onClick={toggleTheme}>
                    Toggle Theme
                </button>
            </div>
        </Router>
    );
};

export default App;