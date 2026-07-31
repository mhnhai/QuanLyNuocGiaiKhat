import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const withAdminAuth = (WrappedComponent) => {
    return (props) => {
        const { isAuthenticated, loading } = useAuth();

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <span className="loading loading-spinner loading-md text-primary" />
                </div>
            );
        }

        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAdminAuth;
