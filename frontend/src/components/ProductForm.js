import React, { useState, useEffect } from 'react';
import ProductService from "../services/product.service";
import SupplierService from "../services/supplier.service";

const ProductForm = ({ product, onSave }) => {
    const [formData, setFormData] = useState({
        id_supplier: '',
        name: '',
        import_price: '',
        selling_price: '',
        category: '',
        stock: '',
        volume: '',
        origin: '',
        description: '',
    });

    const categories = [   { key: 'barrel', name: 'Thùng' },
        { key: 'pack', name: 'Lốc 6 lon' },
        // { key: 'case', name: 'Kết' },
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
                    <select name="id_supplier" value={formData.id_supplier} onChange={handleChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">-- Chọn nhà cung cấp --</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Giá nhập:</label>
                    <input type="text" name="import_price" value={formData.import_price} onChange={handleChange}
                           required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá bán:</label>
                    <input type="text" name="selling_price" value={formData.selling_price} onChange={handleChange}
                           required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300   rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
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
            <button type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save
                Product
            </button>
        </form>
    );
};

export default ProductForm ;