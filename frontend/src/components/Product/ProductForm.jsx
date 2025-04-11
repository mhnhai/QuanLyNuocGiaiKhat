import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ProductService from "../../services/product.service";
import SupplierService from "../../services/supplier.service";
import CategoryService from "../../services/category.service";
import { Button } from "../Button";
import {IoMdClose} from "react-icons/io";
import uploadService from '../../services/upload.service';
import { FaTrash } from 'react-icons/fa';

const validationSchema = yup.object({
    name: yup.string().min(2,'Tên sản phẩm phải có ít nhất 2 ký tự').max(100,'Tên sản phẩm chỉ có tối đa 100 ký tự').required('Nhập vào tên'),
    selling_price: yup.number().required('Nhập số tiền').positive('Số tiền phải dương'),
    category: yup.string().required('Chọn loại hàng'),
    volume: yup.string().min(2,'Dung tích sản phẩm phải có ít nhất 2 ký tự').max(10,'Dung tích sản phẩm chỉ có tối đa 10 ký tự').required('Nhập dung tích sản phẩm'),
    origin: yup.string().min(2,'Nguồn gốc sản phẩm phải có ít nhất 2 ký tự').max(30,'Nguồn gốc sản phẩm chỉ có tối đa 30 ký tự').required('Nhập nguồn gốc'),
    description: yup.string().min(10,'Mô tả phải có ít nhất 10 ký tự').max(1000,'Mô tả chỉ có tối đa 1000 ký tự').required('Nhập mô tả'),
    image: yup.string().required('Nhập ảnh'),
    supplier_price: yup.array().of(
        yup.object({
            id_supplier: yup.string().required('Nhập nhà cung cấp'),
            import_price: yup.number().required('Nhập số tiền').positive('Số tiền phải dương')
        })
    ).min(1, 'Vui lòng thêm ít nhất một nhà cung cấp')
});

const ProductForm = ({ product, onSave, onClose }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [supplierPrices, setSupplierPrices] = useState(
        product?.supplier_price || [{ id_supplier: '', import_price: '' }]
    );
    
    const formik = useFormik({
        initialValues: {
            name: product?.name || '',
            selling_price: product?.selling_price || '',
            category: product?.category || '',
            stock: product?.stock || 0,
            volume: product?.volume || '',
            origin: product?.origin || '',
            description: product?.description || '',
            image: product?.image || '',
            supplier_price: product?.supplier_price || [{ id_supplier: '', import_price: '' }]
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let imageUrl = values.image;
                
                if (imageFile) {
                    const uploadResponse = await uploadService.uploadImage(imageFile);
                    imageUrl = uploadResponse.data?.filename || uploadResponse.data || uploadResponse;
                    
                    if (product?.image) {
                        try {
                            await uploadService.deleteImage(product.image);
                        } catch (error) {
                            console.error('Error deleting old image:', error);
                        }
                    }
                }

                const finalImageValue = imageFile ? 
                    (typeof imageUrl === 'object' && imageUrl.filename ? imageUrl.filename : imageUrl) : 
                    values.image;

                let response;
                if (product) {
                    response = await ProductService.update(product._id, { 
                        ...values, 
                        image: finalImageValue,
                        supplier_price: supplierPrices.filter(sp => sp.id_supplier && sp.import_price)
                    });
                } else {
                    response = await ProductService.create({ 
                        ...values, 
                        image: finalImageValue,
                        supplier_price: supplierPrices.filter(sp => sp.id_supplier && sp.import_price)
                    });
                }
                onSave(response.data);
            } catch (error) {
                console.error('Error saving product:', error);
            }
        }
    });

    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (product) {
            formik.setValues(product);
            if (product.image) {
                setImagePreview(uploadService.getImageUrl(product.image));
            }
            if (product.supplier_price) {
                setSupplierPrices(product.supplier_price);
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

    const handleAddSupplierPrice = () => {
        setSupplierPrices([...supplierPrices, { id_supplier: '', import_price: '' }]);
    };

    const handleRemoveSupplierPrice = (index) => {
        const newSupplierPrices = supplierPrices.filter((_, i) => i !== index);
        setSupplierPrices(newSupplierPrices);
        formik.setFieldValue('supplier_price', newSupplierPrices);
    };

    const handleSupplierPriceChange = (index, field, value) => {
        const newSupplierPrices = [...supplierPrices];
        newSupplierPrices[index] = {
            ...newSupplierPrices[index],
            [field]: value
        };
        setSupplierPrices(newSupplierPrices);
        formik.setFieldValue('supplier_price', newSupplierPrices);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            formik.setFieldValue('image', 'pending_upload');
        }
    };

    const handleDeleteImage = async () => {
        try {
            if (product?.image) {
                await uploadService.deleteImage(product.image);
                // Cập nhật dữ liệu sản phẩm trong cơ sở dữ liệu
                const updatedProduct = await ProductService.update(product._id, {
                    ...formik.values, // giữ lại các giá trị khác
                    image: '', // cập nhật image thành rỗng
                });
                onSave(updatedProduct.data); // thông báo cho component cha cập nhật lại dữ liệu
            }
            setImagePreview(null);
            setImageFile(null);
            formik.setFieldValue('image', '');
        } catch (error) {
            console.error('Error deleting image:', error);
        }
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

                <div className="col-span-1">
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

                <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700">Mô tả:</label>
                    <textarea
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 block w-full h-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                className="btn btn-sm btn-outline btn-error mt-4"
                            >
                                Xóa ảnh
                            </button>
                        </div>
                    )}
                </div>

                <div className="col-span-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Nhà cung cấp và giá nhập:</label>
                        <button
                            type="button"
                            onClick={handleAddSupplierPrice}
                            className="btn btn-sm btn-primary"
                        >
                            Thêm nhà cung cấp
                        </button>
                    </div>
                    {supplierPrices.map((supplierPrice, index) => (
                        <div key={index} className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <Select
                                    value={suppliers.find(option => option.value === supplierPrice.id_supplier)}
                                    onChange={(selectedOption) => handleSupplierPriceChange(index, 'id_supplier', selectedOption ? selectedOption.value : '')}
                                    options={suppliers}
                                    className="mt-1 block w-full"
                                    placeholder="-- Chọn nhà cung cấp --"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={supplierPrice.import_price}
                                    onChange={(e) => handleSupplierPriceChange(index, 'import_price', e.target.value)}
                                    placeholder="Giá nhập"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveSupplierPrice(index)}
                                className="btn btn-square btn-error mt-1"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                    {formik.touched.supplier_price && formik.errors.supplier_price && (
                        <p className="text-red-500 text-xs mt-1">
                            {typeof formik.errors.supplier_price === 'string' 
                                ? formik.errors.supplier_price 
                                : 'Vui lòng điền đầy đủ thông tin nhà cung cấp và giá nhập'}
                        </p>                   
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