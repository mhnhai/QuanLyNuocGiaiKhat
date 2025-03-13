import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Login from './components/Login';
import Logout from "./components/Logout";
import ProductDetail from './pages/ProductDetail';
import Profile from './components/Profile'
import Cart from './pages/Cart';
import Register from './components/Register'
import History from './components/History';
import Search from './pages/Search';
import SoftDrinks from './pages/categories/SoftDrinks';
import EnergyDrinks from './pages/categories/EnergyDrinks';
import PureWater from './pages/categories/PureWater';
import Alcohol from './pages/categories/Alcohol';
import TeaAndJuice from './pages/categories/TeaAndJuice';

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
            <div className="bg-base-200 flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1 p-6">
                    <Routes>
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/cart" element={<Cart/>} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/category/soft-drinks" element={<SoftDrinks />} />
                        <Route path="/category/energy-drinks" element={<EnergyDrinks />} />
                        <Route path="/category/pure-water" element={<PureWater />} />
                        <Route path="/category/alcohol" element={<Alcohol />} />
                        <Route path="/category/tea-and-juice" element={<TeaAndJuice />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;