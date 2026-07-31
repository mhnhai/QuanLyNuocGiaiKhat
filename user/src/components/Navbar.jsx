import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaChevronDown } from "react-icons/fa";
import { LuSunMedium } from "react-icons/lu";
import { IoMoonOutline, IoCart } from "react-icons/io5";
import ProductService from "../services/product.service";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";

const categoryLinks = [
    { path: '/category/soft-drinks', name: 'Nước ngọt' },
    { path: '/category/energy-drinks', name: 'Nước tăng lực' },
    { path: '/category/pure-water', name: 'Nước tinh khiết' },
    { path: '/category/alcohol', name: 'Bia, rượu' },
    { path: '/category/tea-and-juice', name: 'Nước trà, nước ép' }
];

const Navbar = () => {
    const [theme, setTheme] = useState("light");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    const handleCategoryClick = (category) => {
        navigate('/products', { state: { selectedCategory: category } });
    };

    const { user } = useAuth();
    
    return (
        <div className="navbar bg-base-100 shadow-sm z-10 h-fit sticky top-0">
            {/* Left section */}
            <div className="flex-none">
                <Link to={"/"}>
                    <div className="btn btn-ghost">
                        Trang chủ
                    </div>
                </Link>

                <div className="dropdown dropdown-hover">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        Danh mục
                        <FaChevronDown className="ml-2" />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <Link to="/products">Tất cả sản phẩm</Link>
                        </li>
                        <div className="divider my-1"></div>
                        {categoryLinks.map(category => (
                            <li key={category.path}>
                                <Link to={category.path}>
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Center section - Search Bar */}
            <div className="flex-1 justify-center">
                <SearchBar />
            </div>

            {/* Right section */}
            <div className="flex-none">
                <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
                        {theme === "light" ? <IoMoonOutline className="text-xl" /> : <LuSunMedium className="text-xl" />}
                    </button>

                    <Link to="/cart" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <IoCart className="text-xl" />
                            <span className="badge badge-sm indicator-item">
                                {JSON.parse(localStorage.getItem('cart'))?.length || 0}
                            </span>
                        </div>
                    </Link>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost">
                                <FaUser className="text-xl" />
                                <span className="ml-2">{user.username}</span>
                                <FaChevronDown className="ml-2" />
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <Link to="/profile">Thông tin cá nhân</Link>
                                </li>
                                <li>
                                    <Link to="/history">Lịch sử mua hàng</Link>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <Link to="/logout" className="text-error">Đăng xuất</Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;