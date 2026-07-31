import React from "react";
import PageHeader from "../components/PageHeader";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
    const { theme } = useTheme();
    const { user } = useAuth();

    return (
        <div>
            <PageHeader title="Cài đặt" subtitle="Tùy chỉnh giao diện và thông tin tài khoản" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl">
                <div className="card bg-base-100 border border-base-300 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-base">Giao diện</h2>
                        <p className="text-sm text-base-content/60">
                            Chế độ hiện tại: <span className="font-semibold capitalize">{theme === "dark" ? "Tối" : "Sáng"}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            <ThemeToggle />
                            <span className="text-sm text-base-content/60">Nhấn để đổi chế độ sáng/tối</span>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-base">Tài khoản</h2>
                        {user && (
                            <ul className="text-sm space-y-2 mt-1">
                                <li><span className="text-base-content/60">Họ tên:</span> <span className="font-medium">{user.name}</span></li>
                                <li><span className="text-base-content/60">Username:</span> <span className="font-medium">{user.username}</span></li>
                                <li><span className="text-base-content/60">Vai trò:</span> <span className="badge badge-primary badge-sm capitalize">{user.role}</span></li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
