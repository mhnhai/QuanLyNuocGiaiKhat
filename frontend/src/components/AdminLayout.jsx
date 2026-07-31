import React, { useState } from "react";
import Sidebar, { MobileNav, MobileMenuButton } from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
    const { user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-base-200">
            <Sidebar />
            <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-300 px-4 sm:px-6 sticky top-0 z-20 min-h-14">
                    <MobileMenuButton onClick={() => setMobileOpen(true)} />
                    <div className="flex-1">
                        <span className="text-sm text-base-content/50 hidden sm:inline">
                            Hệ thống quản lý
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {user && (
                            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-base-300">
                                <div className="avatar placeholder">
                                    <div className="bg-primary text-primary-content rounded-full w-8">
                                        <span className="text-xs">{user.name?.charAt(0)?.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium leading-tight">{user.name}</p>
                                    <p className="text-base-content/50 text-xs capitalize">{user.role}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
