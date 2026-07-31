import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const performLogout = async () => {
            await logout();
            navigate('/login');
        };
        performLogout();
    }, [logout, navigate]);

    return null;
};

export default Logout;
