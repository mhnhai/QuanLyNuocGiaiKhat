import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';



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

        <div className="flex items-center justify-center h-screen">

            <div className="bg-base-100 p-6 rounded shadow-md w-80">

                <h2 className="text-2xl mb-4">Đăng nhập</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <p className="text-sm text-base-content/70 mb-4">

                    Bạn sẽ được chuyển sang Auth0 để xác thực tài khoản.

                </p>

                <button type="button" onClick={login} className="w-full btn btn-primary">

                    Đăng nhập với Auth0

                </button>

                <div className="mt-4">

                    <Link to="/register">

                        <button type="button" className="btn w-full">

                            Chưa có tài khoản? Đăng ký ngay!

                        </button>

                    </Link>

                </div>

            </div>

        </div>

    );

};



export default Login;

