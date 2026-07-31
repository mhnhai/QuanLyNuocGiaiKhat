import React, { useEffect } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import CustomerService from "../services/customer.service";

const validationSchema = yup.object({
    name: yup.string().min(2,'Tên khách hàng phải có ít nhất 2 ký tự').max(50,'Tên khách hàng chỉ có tối đa 50 ký tự').required('Hãy nhập tên'),
    username: yup.string().min(5,'Tên tài khoản phải có ít nhất 5 ký tự').max(20,'Tên tài khoản chỉ có tối đa 20 ký tự').required('Hãy nhập tên tài khoản'),
    email: yup.string().email('Email không hợp lệ').max(100, 'Email chỉ có tối đa 100 ký tự').required('Hãy nhập email'),
    password: yup.string().min(6,'Mật khẩu phải có ít nhất 6 ký tự').max(20,'Mật khẩu chỉ có tối đa 20 ký tự').required('Hãy nhập mật khẩu'),
    phone: yup.string().length(10, 'Số điện thoại phải có 10 chữ số').required('Hãy nhập số điện thoại'),
    address: yup.string().max(100,'Địa chỉ chỉ có tối đa 100 ký tự').required('Hãy nhập địa chỉ'),
});
 
const CustomerForm = ({ customer }) => {
    const navigate = useNavigate(); 
    
    const formik = useFormik({
        initialValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            phone: '',
            role_account: 'customer',
            address: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const isRegistered = await CustomerService.checkRegistered(values.username);
                if (isRegistered) {
                    alert('Tên tài khoản đã tồn tại');
                    return;
                }
                await CustomerService.create(values);
                
                navigate('/login');
            } catch (error) {
                console.error('Error saving customer:', error);
            }
        },
    });

    useEffect(() => {
        if (customer) {
            formik.setValues(customer);
        }
    }, [customer, formik]);

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={formik.handleSubmit} className="bg-base-100 p-6 rounded shadow-md w-80">
                <h2 className="text-2xl mb-4">Đăng ký</h2>
                <div className="mb-4">
                    <label className="block">Họ tên:</label>
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label className="block">Tên tài khoản:</label>
                    <input
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label className="block">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label className="block">Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label className="block">Số điện thoại:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
                    ) : null}
                </div>
            
                <div className="mb-4">
                    <label className="block">Địa chỉ:</label>
                    <input
                        type="text"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {formik.touched.address && formik.errors.address ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.address}</p>
                    ) : null}
                </div>
                <button type="submit" className="w-full btn btn-primary">Đăng ký</button>
            </form>
        </div>
    );
};

export default CustomerForm;