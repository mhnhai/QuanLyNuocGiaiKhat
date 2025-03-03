import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBeer, FaUser, FaHome, FaCartPlus, FaCogs, FaUserTie, FaCartArrowDown, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className="flex flex-col h-screen w-64 bg-gray-800 text-white shadow-lg">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Quản lý nước giải khát</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <SidebarItem icon={<FaHome />} label="Trang chủ" to="/" active={location.pathname === "/"} />
                <SidebarItem icon={<FaBeer />} label="Quản lý sản phẩm" to="/products" active={location.pathname === "/products"} />
                <SidebarItem icon={<FaUser />} label="Khách hàng" to="/customers" active={location.pathname === "/customers"} />
                <SidebarItem icon={<FaCartPlus />} label="Đơn hàng" to="/orders" active={location.pathname === "/orders"} />
                <SidebarItem icon={<FaCartArrowDown />} label="Nhập hàng" to="/importations" active={location.pathname === "/importations"} />
                <SidebarItem icon={<FaUserTie />} label="Nhân viên" to="/staffs" active={location.pathname === "/staffs"} />
                <SidebarItem icon={<FaUser />} label="Nhà cung cấp" to="/suppliers" active={location.pathname === "/suppliers"} />
                <SidebarItem icon={<FaCogs />} label="Cài đặt" to="/settings" active={location.pathname === "/settings"} />
            </nav>
            <p className="p-2">Xin chào, {user.name}</p>
            <SidebarItem icon={<FaSignOutAlt />} label="Đăng xuất" to="/logout" active={location.pathname === "/logout"} />
        </div>
    );
};

const SidebarItem = ({ icon, label, to, active }) => (
    <Link to={to}>
        <div className={`flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer transition ${active ? "bg-gray-700" : ""}`}>
            <div className="mr-3 text-lg">{icon}</div>
            <span>{label}</span>
        </div>
    </Link>
);

export default Sidebar;