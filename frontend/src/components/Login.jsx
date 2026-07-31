import React, { useEffect, useState } from 'react';

import { FaBeer } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

import ThemeToggle from './ThemeToggle';



const Login = () => {

    const [error, setError] = useState('');

    const { login } = useAuth();



    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const authError = params.get('error');

        if (authError) {

            setError(decodeURIComponent(authError.replace(/\+/g, ' ')));

        }

    }, []);



    return (

        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 relative">

            <div className="absolute top-4 right-4">

                <ThemeToggle />

            </div>



            <div className="w-full max-w-md">

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-content mb-4 shadow-lg">

                        <FaBeer className="text-3xl" />

                    </div>

                    <h1 className="text-2xl font-bold text-base-content">Quản lý nước giải khát</h1>

                    <p className="text-base-content/60 mt-1">Đăng nhập vào hệ thống admin</p>

                </div>



                <div className="card bg-base-100 shadow-xl border border-base-300">

                    <div className="card-body gap-4">

                        <h2 className="card-title text-lg">Đăng nhập</h2>



                        {error && (

                            <div className="alert alert-error text-sm py-2">

                                <span>{error}</span>

                            </div>

                        )}



                        <p className="text-sm text-base-content/70">

                            Bạn sẽ được chuyển sang Auth0 để xác thực tài khoản.

                        </p>



                        <button

                            type="button"

                            onClick={login}

                            className="btn btn-primary w-full mt-2"

                        >

                            Đăng nhập với Auth0

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};



export default Login;

