import React, { useEffect, useState } from 'react';
import OrderService from "../services/order.service";
import ProductService from "../services/product.service";
import statusService from "../services/status.service";
import formatDateTime from "../utils/formatDateTime";
import { Button } from "./Button";

const OrderForm = ({ order, onSave }) => {
    const [formData, setFormData] = useState(order || {
        id_customer: '',
        id_staff: '',
        order_date: new Date().toISOString(),
        shipping_date: new Date().toISOString(),
        form_payment: '',
        total_price: '',
        status: '',
        order_items: [{ id_product: '', quantity: '', selling_price: '' }]
    });
    const [products, setProducts] = useState([]);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        if (order) {
            setFormData(order);
        }
    }, [order]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, statusesResponse] = await Promise.all([
                    ProductService.getAll(),
                    statusService.getStatuses()
                ]);
                setProducts(productsResponse.data);
                setStatuses(statusesResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const calculateTotalPrice = (orderItems) => {
        return orderItems.reduce((total, item) => {
            return total + (item.selling_price * item.quantity);
        }, 0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = formData.order_items.map((product, i) => {
            if (i === index) {
                const updatedProduct = { ...product, [name]: value };
                if (name === 'id_product') {
                    const selectedProduct = products.find(p => p._id === value);
                    updatedProduct.selling_price = selectedProduct ? selectedProduct.selling_price : '';
                }
                return updatedProduct;
            }
            return product;
        });
        const totalPrice = calculateTotalPrice(updatedProducts);
        setFormData({
            ...formData,
            order_items: updatedProducts,
            total_price: totalPrice
        });
    };

    const addProduct = () => {
        setFormData({
            ...formData,
            order_items: [...formData.order_items, { id_product: '', quantity: '', selling_price: '' }]
        });
    };

    const removeProduct = (index) => {
        const updatedProducts = formData.order_items.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            order_items: updatedProducts
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedOrderItems = formData.order_items.map(item => {
                const product = products.find(p => p._id === item.id_product);
                return {
                    ...item,
                    selling_price: product ? product.selling_price : item.selling_price
                };
            });

            const updatedFormData = {
                ...formData,
                order_items: updatedOrderItems,
            };

            let response;
            if (order?._id) {
                response = await OrderService.update(order._id, updatedFormData);
            } else {
                updatedFormData.status = statuses[0];
                response = await OrderService.create(updatedFormData);
            }

            for (const item of updatedOrderItems) {
                const product = products.find(p => p._id === item.id_product);
                if (product) {
                    const updatedProduct = {
                        ...product,
                        stock: product.stock - parseInt(item.quantity, 10)
                    };
                    await ProductService.update(product._id, updatedProduct);
                }
            }
            onSave(response.data);
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    const handleNextStatus = async () => {
        const currentIndex = statuses.indexOf(formData.status);
        const nextStatus = statuses[currentIndex + 1];
        if (nextStatus && window.confirm(`Xác nhận ${nextStatus}?`)) {
            setFormData({
                ...formData,
                status: nextStatus
            });
        }
    };

    const handleCancelOrder = async () => {
        if (window.confirm("Are you sure you want to cancel the order?")) {
            setFormData({
                ...formData,
                status: "Đã hủy"
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3" >
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer ID:</label>
                    <input type="text" name="id_customer" value={formData.id_customer} onChange={handleChange} required disabled={!!order}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Staff ID:</label>
                    <input type="text" name="id_staff" value={formData.id_staff} onChange={handleChange} required disabled={!!order}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày tạo đơn: {formatDateTime(formData.order_date)}</label>
                    <input type="hidden" name="order_date" value={formData.order_date} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày chuyển hàng: {formatDateTime(formData.shipping_date)}</label>
                    <input type="hidden" name="shipping_date" value={formData.shipping_date} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Form of Payment:</label>
                    <input type="text" name="form_payment" value={formData.form_payment} onChange={handleChange} required disabled={!!order}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Price:</label>
                    <input type="number" step="0.01" name="total_price" value={formData.total_price} disabled
                           onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status:</label>
                    <input type="text" name="status" value={formData.status} onChange={handleChange} disabled
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Products:</label>
                {formData.order_items.map((product, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3 mb-2">
                        <select name="id_product" value={product.id_product}
                                onChange={(e) => handleProductChange(index, e)} required
                                disabled={!!order}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select Product</option>
                            {products.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                        <input type="number" name="quantity" value={product.quantity} onChange={(e) => handleProductChange(index, e)} required
                               disabled={!!order}
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Quantity" />
                        <input type="text" name="selling_price" value={product.selling_price} disabled
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Selling Price" />
                        {!order && (
                            <button type="button" onClick={() => removeProduct(index)} className="mt-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Remove</button>
                        )}
                    </div>
                ))}
                {!order && (
                    <button type="button" onClick={addProduct} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Thêm sản phẩm</button>
                )}
            </div>

            <Button type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700">Lưu
            </Button>

            {formData.status !== statuses[statuses.length - 1] && (
                <Button type="button" onClick={handleNextStatus} disabled={formData.status === "Đã hủy"}
                        className="bg-green-600 hover:bg-green-700">
                    {formData.status === "Đã hủy" ? "Order Cancelled" : `${statuses[statuses.indexOf(formData.status) + 1] || "N/A"}`}
                </Button>
            )}
            {formData.status === statuses[0] && (
                <button type="button" onClick={handleCancelOrder}
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-2">Cancel Order
                </button>
            )}
        </form>
    );
};

export default OrderForm;