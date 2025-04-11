import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomerService from "../../services/customer.service";
import {Button} from "../Button";
import {IoMdClose} from "react-icons/io";

const validationSchema = yup.object({
    name: yup.string().min(2,'Tên khách hàng phải có ít nhất 2 ký tự').max(50,'Tên khách hàng chỉ có tối đa 50 ký tự').required('Hãy nhập tên'),
    username: yup.string().min(5,'Tên tài khoản phải có ít nhất 5 ký tự').max(20,'Tên tài khoản chỉ có tối đa 20 ký tự').required('Hãy nhập tên tài khoản'),
    password: yup.string().min(6,'Mật khẩu phải có ít nhất 6 ký tự').max(20,'Mật khẩu chỉ có tối đa 20 ký tự').required('Hãy nhập mật khẩu'),
    phone: yup.string().length(10, 'Số điện thoại phải có 10 chữ số').required('Hãy nhập số điện thoại'),
    address: yup.string().max(100,'Địa chỉ chỉ có tối đa 100 ký tự').required('Hãy nhập địa chỉ'),
});

const CustomerForm = ({ customer, onSave, onClose }) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            username: '',
            password: '',
            phone: '',
            address: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let response;
                if (customer) {
                    response = await CustomerService.update(customer._id, values);
                } else {
                    const isRegistered = await CustomerService.checkRegistered(values.username);
                    if (isRegistered) {
                        alert('Tên tài khoản đã tồn tại');
                        return;
                    }
                    response = await CustomerService.create(values);
                }
                onSave(response.data);
            } catch (error) {
                console.error('Error saving customer:', error);
            }
        },
    });


    useEffect(() => {
        if (customer) {
            formik.setValues(customer);
        }
    }, [customer]);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={onClose} type="button">
                    <IoMdClose size={24}/>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên khách hàng:</label>
                    <input
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên tài khoản:</label>
                    <input
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ:</label>
                    <input
                        type="text"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.address && formik.errors.address ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.address}</p>
                    ) : null}
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="submit" className="btn btn-neutral">Lưu</button>
            </div>
        </form>
    );
};

export default CustomerForm;