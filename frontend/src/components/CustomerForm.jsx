import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomerService from '../services/customer.service';
import { Button } from "./Button";
import { IoMdClose } from "react-icons/io";

const validationSchema = yup.object({
    fullname: yup.string().required('Họ tên là bắt buộc'),
    address: yup.string().required('Địa chỉ là bắt buộc'),
    phone: yup.string().length(10, 'Số điện thoại phải có 10 chữ số').required('Số điện thoại là bắt buộc'),
});

const CustomerForm = ({ customer, onSave, onClose }) => {
    const formik = useFormik({
        initialValues: {
            fullname: '',
            address: '',
            phone: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let response;
                if (customer) {
                    response = await CustomerService.update(customer._id, values);
                } else {
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
                    <label className="block text-sm font-medium text-gray-700">Họ tên:</label>
                    <input
                        type="text"
                        name="fullname"
                        value={formik.values.fullname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.fullname && formik.errors.fullname ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.fullname}</p>
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
                <Button type="submit">Lưu</Button>
            </div>
        </form>
    );
};

export default CustomerForm;