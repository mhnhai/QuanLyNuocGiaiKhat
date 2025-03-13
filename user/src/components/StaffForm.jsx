import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { useFormik } from 'formik';
import * as yup from 'yup';
import StaffService from "../services/staff.service";
import PositionService from "../services/position.service";
import RoleService from "../services/role.service";
import {Button} from "./Button";
import {IoMdClose} from "react-icons/io";

const validationSchema = yup.object({
    name: yup.string().required('Hãy nhập tên'),
    username: yup.string().required('Hãy nhập tên tài khoản'),
    password: yup.string().required('Hãy nhập mật khẩu'),
    position: yup.string().required('Hãy chọn vị trí công việc'),
    salary: yup.number().required('Salary is required').positive('Salary must be a positive number'),
    birth_date: yup.date().required('Birth Date is required'),
    phone: yup.string().length(10, 'Số điện thoại phải có 10 chữ số').required('Hãy nhập số điện thoại'),
    role_account: yup.string().required('Hãy chọn vai trò cho tài khoản'),
    address: yup.string().required('Hãy nhập địa chỉ'),
});

const StaffForm = ({ staff, onSave, onClose }) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            username: '',
            password: '',
            position: '',
            salary: '',
            birth_date: '',
            phone: '',
            role_account: '',
            address: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let response;
                if (staff) {
                    response = await StaffService.update(staff._id, values);
                } else {
                    response = await StaffService.create(values);
                }
                onSave(response.data);
            } catch (error) {
                console.error('Error saving staff:', error);
            }
        },
    });

    const [positions, setPositions] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (staff) {
            formik.setValues(staff);
        }
    }, [staff]);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await PositionService.getPositions();
                setPositions(response.map(position => ({
                    value: position,
                    label: position
                })));
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await RoleService.getRoles();
                setRoles(response.map(role => ({
                    value: role.key,
                    label: role.name
                })));
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchPositions();
        fetchRoles();
    }, []);

    const handlePositionChange = (selectedOption) => {
        formik.setFieldValue('position', selectedOption ? selectedOption.value : '');
    };

    const handleRoleChange = (selectedOption) => {
        formik.setFieldValue('role_account', selectedOption ? selectedOption.value : '');
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={onClose} type="button">
                    <IoMdClose size={24}/>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name:</label>
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
                    <label className="block text-sm font-medium text-gray-700">Username:</label>
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
                    <label className="block text-sm font-medium text-gray-700">Password:</label>
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
                    <label className="block text-sm font-medium text-gray-700">Position:</label>
                    <Select
                        value={positions.find(option => option.value === formik.values.position)}
                        onChange={handlePositionChange}
                        options={positions}
                        className="mt-1 block w-full"
                        placeholder="-- Select Position --"
                    />
                    {formik.touched.position && formik.errors.position ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.position}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Salary:</label>
                    <input
                        type="text"
                        name="salary"
                        value={formik.values.salary}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.salary && formik.errors.salary ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.salary}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Birth Date:</label>
                    <input
                        type="date"
                        name="birth_date"
                        value={formik.values.birth_date.split('T')[0]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.birth_date && formik.errors.birth_date ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.birth_date}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone:</label>
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
                    <label className="block text-sm font-medium text-gray-700">Role Account:</label>
                    <Select
                        value={roles.find(option => option.value === formik.values.role_account)}
                        onChange={handleRoleChange}
                        options={roles}
                        className="mt-1 block w-full"
                        placeholder="-- Select Role --"
                    />
                    {formik.touched.role_account && formik.errors.role_account ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.role_account}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address:</label>
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
                <button className="btn btn-neutral">Lưu</button>
            </div>
        </form>
    );
};

export default StaffForm;