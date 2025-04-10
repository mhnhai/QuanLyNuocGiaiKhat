import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import isCustomer from "../components/Authentication";
import { Link } from 'react-router-dom';
const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const customer = await isCustomer(username, password);
        if(!customer){
                alert('Sai tên đăng nhập hoặc mật khẩu');
        }  else {
            const user = {id: customer._id ,name: customer.name, role: customer.role_account};
            localStorage.setItem('user', JSON.stringify(user));
            onLogin();
            navigate('/');
        }
    }


    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded shadow-md w-80">
                <h2 className="text-2xl mb-4">Đăng nhập</h2>
                <div className="mb-4">
                    <label className="block mb-1">Tên đăng nhập</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full btn btn-primary">Đăng nhập</button>
                <div className="mt-4">
                    <Link to={"/register"}>
                        <button className='btn w-full'>
                            Chưa có tài khoản? Đăng ký ngay!
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;