import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuSunMedium } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "user-theme";

const Settings = () => {
    const { user, isAuthenticated } = useAuth();
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "dark" || saved === "light") return saved;
        return document.documentElement.getAttribute("data-theme") || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Cài đặt</h1>

            <div className="card bg-base-100 shadow-md border border-base-300 mb-4">
                <div className="card-body">
                    <h2 className="card-title text-base">Giao diện</h2>
                    <p className="text-sm text-base-content/60">
                        Chế độ: <span className="font-medium">{theme === "dark" ? "Tối" : "Sáng"}</span>
                    </p>
                    <button type="button" className="btn btn-outline btn-sm gap-2 w-fit mt-2" onClick={toggleTheme}>
                        {theme === "dark" ? <LuSunMedium /> : <IoMoonOutline />}
                        {theme === "dark" ? "Bật chế độ sáng" : "Bật chế độ tối"}
                    </button>
                </div>
            </div>

            {isAuthenticated && user && (
                <div className="card bg-base-100 shadow-md border border-base-300">
                    <div className="card-body">
                        <h2 className="card-title text-base">Tài khoản</h2>
                        <p className="text-sm">
                            <span className="text-base-content/60">Xin chào, </span>
                            <span className="font-medium">{user.name}</span>
                        </p>
                        <Link to="/profile" className="btn btn-primary btn-sm w-fit mt-2">
                            Xem hồ sơ
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
