import React from "react";
import { LuSunMedium } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`btn btn-ghost btn-circle swap swap-rotate ${className}`}
            aria-label={isDark ? "Bật chế độ sáng" : "Bật chế độ tối"}
            title={isDark ? "Chế độ sáng" : "Chế độ tối"}
        >
            {isDark ? <LuSunMedium className="text-xl" /> : <IoMoonOutline className="text-xl" />}
        </button>
    );
};

export default ThemeToggle;
