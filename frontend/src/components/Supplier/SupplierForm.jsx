import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import SupplierService from "../../services/supplier.service";
import { Button } from "../Button";
import {IoMdClose} from "react-icons/io";

const validationSchema = yup.object({
    name: yup.string().min(2,'Tên nhà cung cấp phải có ít nhất 2 ký tự').max(50,'Tên nhà cung cấp chỉ có tối đa 50 ký tự').required('Hãy nhập tên'),
    email: yup.string().email('Email phải đúng định dạng(abc@1234...)').required('Hãy nhập email'),
    address: yup.string().max(100,'Địa chỉ chỉ có tối đa 100 ký tự').required('Hãy nhập địa chỉ'),
    phone: yup.string().length(10, 'Số điện thoại phải có 10 chữ số').required('Hãy nhập số điện thoại'),
});

const SupplierForm = ({ supplier, onSave, onClose }) => {
    const formik = useFormik( {
        initialValues: {
            name: '',
            email: '',
            address: '',
            phone: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let response;
                if (supplier) {
                    response = await SupplierService.update(supplier._id, values);
                } else {
                    response = await SupplierService.create(values);
                }
                onSave(response.data);
            } catch (error) {
                console.error('Error saving supplier:', error);
            }
        },
    });

    useEffect(() => {
        if (supplier) {
            formik.setValues(supplier);
        }
    }, [supplier]);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={onClose} type="button">
                    <IoMdClose size={24}/>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên nhà cung cấp:</label>
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
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
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
            </div>
            <div className="flex justify-end space-x-2">
                <button className="btn btn-neutral">Lưu</button>
            </div>
        </form>
    );
};

export default SupplierForm;