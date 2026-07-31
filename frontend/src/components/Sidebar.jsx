import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaBeer,
    FaUser,
    FaHome,
    FaCartPlus,
    FaCogs,
    FaUserTie,
    FaCartArrowDown,
    FaSignOutAlt,
    FaTruck,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { icon: FaHome, label: "Trang chủ", to: "/" },
    { icon: FaBeer, label: "Sản phẩm", to: "/products" },
    { icon: FaUser, label: "Khách hàng", to: "/customers" },
    { icon: FaCartPlus, label: "Đơn hàng", to: "/orders" },
    { icon: FaCartArrowDown, label: "Nhập hàng", to: "/importations" },
    { icon: FaUserTie, label: "Nhân viên", to: "/staffs", adminOnly: true },
    { icon: FaTruck, label: "Nhà cung cấp", to: "/suppliers", adminOnly: true },
    { icon: FaCogs, label: "Cài đặt", to: "/settings" },
];

const Sidebar = ({ mobile = false, onNavigate }) => {
    const location = useLocation();
    const { user } = useAuth();

    if (!user) return null;

    const isAdmin = user.role !== "staff";
    const items = navItems.filter((item) => !item.adminOnly || isAdmin);

    const content = (
        <>
            {!mobile && (
                <div className="flex items-center gap-3 px-5 h-16 border-b border-base-300">
                    <div className="bg-primary text-primary-content rounded-xl p-2">
                        <FaBeer className="text-lg" />
                    </div>
                    <div>
                        <p className="font-bold text-sm leading-tight">NuocGiaiKhat</p>
                        <p className="text-xs text-base-content/50">Admin Panel</p>
                    </div>
                </div>
            )}

            <nav className={`flex-1 p-3 space-y-1 overflow-y-auto ${mobile ? "pt-2" : ""}`}>
                {items.map((item) => (
                    <Link key={item.to} to={item.to} onClick={onNavigate}>
                        <div
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                location.pathname === item.to
                                    ? "bg-primary text-primary-content shadow-md"
                                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                            }`}
                        >
                            <item.icon />
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            <div className="p-3 border-t border-base-300">
                <Link to="/logout" onClick={onNavigate}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error/10 transition-colors">
                        <FaSignOutAlt />
                        <span className="text-sm font-medium">Đăng xuất</span>
                    </div>
                </Link>
            </div>
        </>
    );

    if (mobile) {
        return <div className="flex flex-col h-full bg-base-100">{content}</div>;
    }

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-base-100 border-r border-base-300 shadow-sm">
            {content}
        </aside>
    );
};

export const MobileNav = ({ open, onClose }) => {
    if (!open) return null;
    return (
        <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
            <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] shadow-2xl bg-base-100">
                <div className="flex justify-end p-2 border-b border-base-300 bg-base-100">
                    <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <Sidebar mobile onNavigate={onClose} />
            </div>
        </div>
    );
};

export const MobileMenuButton = ({ onClick }) => (
    <button type="button" className="btn btn-ghost btn-circle md:hidden" onClick={onClick} aria-label="Mở menu">
        <FaBars />
    </button>
);

export default Sidebar;
