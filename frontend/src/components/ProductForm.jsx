import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ProductService from "../services/product.service";
import SupplierService from "../services/supplier.service";
import CategoryService from "../services/category.service";
import { Button } from "./Button";
import {IoMdClose} from "react-icons/io";
import uploadService from '../services/upload.service';

const validationSchema = yup.object({
    id_supplier: yup.string().required('Nhập nhà cung cấp'),
    name: yup.string().required('Nhập vào tên'),
    import_price: yup.number().required('Nhập số tiền').positive('Số tiền phải dương'),
    selling_price: yup.number().required('Nhập số tiền').positive('Số tiền phải dương'),
    category: yup.string().required('Chọn loại hàng'),
    volume: yup.string().required('Nhập dung tích sản phẩm'),
    origin: yup.string().required('Nhập nguồn gốc'),
    description: yup.string().required('Nhập mô tả'),
    image: yup.string().required('Nhập ảnh'),
});

const ProductForm = ({ product, onSave, onClose }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    
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
            image: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let imageUrl = values.image;
                
                // If we have a new image file, upload it first
                if (imageFile) {
                    const uploadResponse = await uploadService.uploadImage(imageFile);
                    // Handle different response structures
                    imageUrl = uploadResponse.data?.filename || uploadResponse.data || uploadResponse;
                    
                    // If this is an update and we have an old image, delete it
                    if (product?.image) {
                        try {
                            await uploadService.deleteImage(product.image);
                        } catch (error) {
                            console.error('Error deleting old image:', error);
                        }
                    }
                }

                let response;
                if (product) {
                    response = await ProductService.update(product._id, { ...values, image: imageUrl.filename });
                } else {
                    response = await ProductService.create({ ...values, image: imageUrl.filename });
                }
                onSave(response.data);
            } catch (error) {
                console.error('Error saving product:', error);
                // If we uploaded a new image but the product creation/update failed,
                // we should delete the newly uploaded image
                if (imageFile && product?.image) {
                    try {
                        await uploadService.deleteImage(product.image);
                    } catch (deleteError) {
                        console.error('Error cleaning up uploaded image:', deleteError);
                    }
                }
            }
        },
    });

    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (product) {
            formik.setValues(product);
            if (product.image) {
                setImagePreview(uploadService.getImageUrl(product.image));
            }
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
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getCategories();
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSupplierChange = (selectedOption) => {
        formik.setFieldValue('id_supplier', selectedOption ? selectedOption.value : '');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            // Set a temporary value for validation
            formik.setFieldValue('image', 'pending_upload');
        }
    };

    const handleDeleteImage = async () => {
        if (product?.image) {
            try {
                await uploadService.deleteImage(product.image);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
        setImagePreview(null);
        setImageFile(null);
        formik.setFieldValue('image', '');
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
                            <option key={category} value={category}>{category}</option>
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
                <div className="col-span-2">
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
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ảnh:</label>
                    {!imagePreview && (
                    <input
                        type="file"
                        name="imageFile"
                        onChange={handleImageChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        accept="image/*"
                    />)}
                    {formik.touched.image && formik.errors.image ? (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.image}</p>
                    ) : null}
                    
                    {imagePreview && (
                        <div className="mt-2">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="h-24 w-auto object-cover rounded-md"
                            />
                            <button 
                                onClick={handleDeleteImage} 
                                className="mt-2 text-red-500 hover:text-red-600"
                            >
                                Xóa ảnh
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end">
                <button 
                    type="submit" 
                    className="btn btn-neutral"
                    disabled={formik.isSubmitting}
                >
                     Lưu
                </button>
            </div>
        </form>
    );
};

export default ProductForm;