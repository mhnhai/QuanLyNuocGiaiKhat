import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import authService from "../services/auth.service";



const AuthContext = createContext(null);



const mapUser = (data) => ({

    id: data.id,

    name: data.name,

    username: data.username,

    role: data.role,

    type: data.type,

});



export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);



    const refreshUser = useCallback(async () => {

        try {

            const response = await authService.getMe();

            setUser(mapUser(response.data));

        } catch {

            setUser(null);

        } finally {

            setLoading(false);

        }

    }, []);



    useEffect(() => {

        refreshUser();

    }, [refreshUser]);



    const login = () => {

        authService.loginCustomer();

    };



    const logout = async () => {

        try {

            const response = await authService.logout();

            setUser(null);

            if (response.data?.logout_url) {

                window.location.href = response.data.logout_url;

            }

        } catch {

            setUser(null);

        }

    };



    return (

        <AuthContext.Provider

            value={{

                user,

                loading,

                isAuthenticated: !!user,

                login,

                logout,

                refreshUser,

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};



export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error("useAuth must be used within AuthProvider");

    }

    return context;

};

