import React, { useState, useEffect } from 'react';
import ProductService from "../services/product.service";
import SupplierService from "../services/supplier.service";
import { Button } from "./Button";

const ProductForm = ({ product, onSave }) => {
    const [formData, setFormData] = useState({
        id_supplier: '',
        supplier_name: '',
        name: '',
        import_price: '',
        selling_price: '',
        category: '',
        stock: 0,
        volume: '',
        origin: '',
        description: '',
    });

    const categories = [
        { key: 'barrel', name: 'Thùng' },
        { key: 'pack', name: 'Lốc 6 lon' },
    ];

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await SupplierService.getAll();
                setSuppliers(response.data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };
        fetchSuppliers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSupplierChange = (e) => {
        const selectedSupplier = suppliers.find(supplier => supplier._id === e.target.value);
        setFormData({
            ...formData,
            id_supplier: selectedSupplier ? selectedSupplier._id : '',
            supplier_name: selectedSupplier ? selectedSupplier.name : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (product) {
                response = await ProductService.update(product._id, formData);
            } else {
                response = await ProductService.create(formData);
            }
            onSave(response.data);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Tên sản phẩm:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Tên nhà cung cấp:</label>
                    <input type="text" name="supplier_name" list="suppliers" value={formData.supplier_name} onChange={handleSupplierChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    <datalist id="suppliers">
                        {suppliers.map((supplier) => (
                            <option value={supplier._id}>{supplier.name}</option>
                        ))}
                    </datalist>
                    <input type="hidden" name="id_supplier" value={formData.id_supplier} />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Giá nhập:</label>
                    <input type="number" name="import_price" value={formData.import_price} onChange={handleChange}
                           required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá bán:</label>
                    <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange}
                           required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại hàng:</label>
                    <select name="category" value={formData.category} onChange={handleChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">-- Chọn loại hàng --</option>
                        {categories.map((category) => (
                            <option key={category.key} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng:</label>
                    <input type="number" name="stock" value={formData.stock} disabled onChange={handleChange}
                           className="mt-1 block w-full px-3 py-2 border bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thể tích:</label>
                    <input type="text" name="volume" value={formData.volume} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Xuất xứ:</label>
                    <input type="text" name="origin" value={formData.origin} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
            </div>
            <div className="flex justify-center">
                <Button type="submit">Lưu</Button>
            </div>
        </form>
    );
};

export default ProductForm;