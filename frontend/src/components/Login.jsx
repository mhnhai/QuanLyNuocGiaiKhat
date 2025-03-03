// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import isStaff from "../components/Authentication";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const staff = await isStaff(username, password);
        if(!staff){
                alert('Sai tên đăng nhập hoặc mật khẩu');
        }  else {
            const user = {id: staff._id ,name: staff.name, role: staff.role_account};
            localStorage.setItem('user', JSON.stringify(user));
            onLogin();
            navigate('/');
        }
    }


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
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
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;