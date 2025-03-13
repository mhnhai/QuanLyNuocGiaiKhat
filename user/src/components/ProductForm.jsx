import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ProductService from "../services/product.service";
import SupplierService from "../services/supplier.service";
import { Button } from "./Button";
import {IoMdClose} from "react-icons/io";

const validationSchema = yup.object({
    id_supplier: yup.string().required('Nhập nhà cung cấp'),
    name: yup.string().required('Nhập vào tên'),
    import_price: yup.number().required('Nhập số tiền').positive('Số tiền phải dương'),
    selling_price: yup.number().required('Nhập số tiền').positive('Số tiền phải dương'),
    category: yup.string().required('Chọn loại hàng'),
    volume: yup.string().required('Nhập dung tích sản phẩm'),
    origin: yup.string().required('Nhập nguồn gốc'),
    description: yup.string().required('Nhập mô tả'),
});

const ProductForm = ({ product, onSave, onClose }) => {
    const formik = useFormik({
        initialValues: {
            id_supplier: '',
            name: '',
            import_price: '',
            selling_price: '',
            category: '',
            stock: 0,
            volume: '',
            origin: '',
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let response;
                if (product) {
                    response = await ProductService.update(product._id, values);
                } else {
                    response = await ProductService.create(values);
                }
                onSave(response.data);
            } catch (error) {
                console.error('Error saving product:', error);
            }
        },
    });

    const categories = [
        { key: 'barrel', name: 'Thùng' },
        { key: 'pack', name: 'Lốc 6 lon' },
    ];

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (product) {
            formik.setValues(product);
        }
    }, [product]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await SupplierService.getAll();
                setSuppliers(response.data.map(supplier => ({
                    value: supplier._id,
                    label: supplier.name
                })));
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };
        fetchSuppliers();
    }, []);

    const handleSupplierChange = (selectedOption) => {
        formik.setFieldValue('id_supplier', selectedOption ? selectedOption.value : '');
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={onClose} type="button">
                    <IoMdClose size={24}/>
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Tên sản phẩm:</label>
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
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Tên nhà cung cấp:</label>
                    <Select
                        value={suppliers.find(option => option.value === formik.values.id_supplier)}
                        onChange={handleSupplierChange}
                        options={suppliers}
                        className="mt-1 block w-full"
                        placeholder="-- Chọn nhà cung cấp --"
                    />
                    {formik.touched.id_supplier && formik.errors.id_supplier ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.id_supplier}</p>
                    ) : null}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Giá nhập:</label>
                    <input
                        type="number"
                        name="import_price"
                        value={formik.values.import_price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.import_price && formik.errors.import_price ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.import_price}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá bán:</label>
                    <input
                        type="number"
                        name="selling_price"
                        value={formik.values.selling_price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.selling_price && formik.errors.selling_price ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.selling_price}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại hàng:</label>
                    <select
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">-- Chọn loại hàng --</option>
                        {categories.map((category) => (
                            <option key={category.key} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                    {formik.touched.category && formik.errors.category ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.category}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng:</label>
                    <input
                        type="number"
                        name="stock"
                        value={formik.values.stock}
                        disabled
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thể tích:</label>
                    <input
                        type="text"
                        name="volume"
                        value={formik.values.volume}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.volume && formik.errors.volume ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.volume}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Xuất xứ:</label>
                    <input
                        type="text"
                        name="origin"
                        value={formik.values.origin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.origin && formik.errors.origin ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.origin}</p>
                    ) : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả:</label>
                    <textarea
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
                    ) : null}
                </div>
            </div>
            <div className="flex justify-end">
                <button className="btn btn-neutral">Lưu</button>
            </div>
        </form>
    );
};

export default ProductForm;