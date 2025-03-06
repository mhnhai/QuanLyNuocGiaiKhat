import React, { useEffect, useState } from 'react';
import ImportationService from "../services/importation.service";
import ProductService from "../services/product.service";
import SupplierService from "../services/supplier.service";
import Select from 'react-select';
import { FaDeleteLeft } from "react-icons/fa6";
import { Button, DeleteButton, EditButton } from "./Button";
import {IoMdAddCircleOutline, IoMdClose} from "react-icons/io";

const ImportationForm = ({ importation, onSave, onClose }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState(importation || {
        id_supplier: '',
        id_staff: user.id,
        import_date: new Date().toISOString(),
        total_price: '',
        import_items: [{ id_product: '', quantity: '', import_price: '' }]
    });
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (importation) {
            setFormData(importation);
        }
    }, [importation]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAll();
                setProducts(response.data.map(product => ({
                    value: product._id,
                    label: product.name,
                    import_price: product.import_price,
                    stock: product.stock
                })));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();

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

    const calculateTotalPrice = (importItems) => {
        return importItems.reduce((total, item) => {
            return total + (item.import_price * item.quantity);
        }, 0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProductChange = (index, selectedOption) => {
        const updatedProducts = formData.import_items.map((product, i) => {
            if (i === index) {
                return {
                    ...product,
                    id_product: selectedOption ? selectedOption.value : '',
                    import_price: selectedOption ? selectedOption.import_price : ''
                };
            }
            return product;
        });
        const totalPrice = calculateTotalPrice(updatedProducts);
        setFormData({
            ...formData,
            import_items: updatedProducts,
            total_price: totalPrice
        });
    };

    const handleQuantityChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = formData.import_items.map((product, i) => {
            if (i === index) {
                return { ...product, [name]: value };
            }
            return product;
        });
        const totalPrice = calculateTotalPrice(updatedProducts);
        setFormData({
            ...formData,
            import_items: updatedProducts,
            total_price: totalPrice
        });
    };

    const addProduct = () => {
        setFormData({
            ...formData,
            import_items: [...formData.import_items, { id_product: '', quantity: '', import_price: '' }]
        });
    };

    const removeProduct = (index) => {
        const updatedProducts = formData.import_items.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            import_items: updatedProducts
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.import_items.length === 0) {
                alert("Phải có ít nhất 1 sản phẩm trong đơn.");
                return;
            }

            const updatedImportItems = formData.import_items.map(item => {
                const product = products.find(p => p.value === item.id_product);
                return {
                    ...item,
                    import_price: product ? product.import_price : item.import_price
                };
            });

            const updatedFormData = {
                ...formData,
                import_items: updatedImportItems
            };
            let response;
            if (importation) {
                response = await ImportationService.update(importation._id, updatedFormData);
            } else {
                response = await ImportationService.create(updatedFormData);
            }

            for (const item of updatedImportItems) {
                const product = await ProductService.getById(item.id_product);
                if (product) {
                    const updatedProduct = {
                        ...product.data,
                        stock: product.data.stock + parseInt(item.quantity, 10)
                    };
                    await ProductService.update(product.data._id, updatedProduct);
                }
            }
            onSave(response.data);
        } catch (error) {
            console.error('Error saving importation:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={onClose} type="button">
                    <IoMdClose size={24} />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nhà cung cấp:</label>
                    <Select
                        value={suppliers.find(option => option.value === formData.id_supplier)}
                        onChange={(selectedOption) => setFormData({
                            ...formData,
                            id_supplier: selectedOption ? selectedOption.value : ''
                        })}
                        options={suppliers}
                        isDisabled={!!importation}
                        className="mt-1 block w-full"
                        placeholder="-- Chọn nhà cung cấp --"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nhân viên tạo đơn:</label>
                    <input type="hidden" name="id_staff" value={formData.id_staff} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    <input type="text" name="id_staff" value={user.name} onChange={handleChange} required
                           disabled
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày nhập:</label>
                    <input type="date" name="import_date" value={formData.import_date.split('T')[0]}
                           onChange={handleChange} required
                           disabled={!!importation}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng cộng:</label>
                    <input type="number" step="0.01" name="total_price" value={formData.total_price} disabled
                           onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="flex justify-between">
                    {!importation && (
                        <Button onClick={addProduct} className="bg-blue-500 hover:bg-blue-600">
                            <IoMdAddCircleOutline size={24}/>
                        </Button>
                    )}
                </div>

            </div>
            <div>
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border">Sản phẩm</th>
                        <th className="py-2 px-4 border">Số lượng</th>
                        <th className="py-2 px-4 border">Giá bán</th>
                        <th className="py-2 px-4 border">Thành tiền</th>
                        {!importation && <th className="py-2 px-4 border">Hành động</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {formData.import_items.map((product, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border">
                                <Select
                                    value={products.find(option => option.value === product.id_product)}
                                    onChange={(selectedOption) => handleProductChange(index, selectedOption)}
                                    options={products}
                                    isDisabled={!!importation}
                                    className="mt-1 block w-full"
                                    placeholder="--Sản phẩm--"
                                />
                            </td>
                            <td className="py-2 px-4 border">
                                <input type="number" name="quantity" value={product.quantity}
                                       onChange={(e) => handleQuantityChange(index, e)} required
                                       disabled={!!importation}
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>

                            </td>
                            <td className="py-2 px-4 border">
                                <input type="text" name="import_price" value={product.import_price} disabled
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>

                            </td>
                            <td className="py-2 px-4 border">
                                {product.quantity * product.import_price}
                            </td>
                            {!importation && (
                                <td className="py-2 px-4 border">
                                <DeleteButton onClick={() => removeProduct(index)}>
                                        <FaDeleteLeft className="mr-2" size={24}/>
                                    </DeleteButton>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end">
                {!importation && (
                    <button className="btn btn-neutral">Lưu</button>
                )}
            </div>

        </form>
    );
};

export default ImportationForm;