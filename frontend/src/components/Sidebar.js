import React from "react";
import { Link } from "react-router-dom";

import { FaBeer, FaUser, FaHome, FaCartPlus, FaCogs, FaUserTie  } from "react-icons/fa";

const Sidebar = () => {
    return (
        <div className="flex flex-col h-screen w-64 bg-gray-800 text-white shadow-lg">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Quản lý Bán Bia</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <SidebarItem icon={<FaHome />} label="Trang chủ" to="/" />
                <SidebarItem icon={<FaBeer />} label="Quản lý sản phẩm" to="/products" />
                <SidebarItem icon={<FaUser />} label="Khách hàng" to="/customers" />
                <SidebarItem icon={<FaCartPlus />} label="Đơn hàng" to="/orders" />
                <SidebarItem icon={<FaUserTie />} label="Nhân viên" to="/staffs" />
                <SidebarItem icon={<FaUser />} label="Nhà cung cấp" to="/suppliers" />
                <SidebarItem icon={<FaCogs />} label="Cài đặt" to="/settings" />
            </nav>
        </div>
    );
};

const SidebarItem = ({ icon, label, to }) => (
    <Link to={to}>
        <div className="flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer">
            <div className="mr-3 text-lg">{icon}</div>
            <span>{label}</span>
        </div>
    </Link>
);

export default Sidebar;
