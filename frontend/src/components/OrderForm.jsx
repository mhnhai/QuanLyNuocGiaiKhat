import React, { useEffect, useState } from 'react';
import OrderService from "../services/order.service";
import CustomerService from "../services/customer.service";
import ProductService from "../services/product.service";
import statusService from "../services/status.service";
import payment_formService from "../services/payment_form.service";
import formatDateTime from "../utils/formatDateTime";
import { Button, DeleteButton } from "./Button";
import { FaDeleteLeft } from "react-icons/fa6";
import {IoMdAddCircleOutline, IoMdClose} from "react-icons/io";
import Select from 'react-select';


const OrderForm = ({ order, onSave, onClose }) => {
    const [formData, setFormData] = useState(order || {
        id_customer: '',
        id_staff: '',
        order_date: new Date().toISOString(),
        shipping_date: null,
        form_payment: '',
        total_price: '',
        status: '',
        order_items: [{ id_product: '', quantity: '', selling_price: '' }]
    });
    const [products, setProducts] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [payment_forms, setPayment_forms] = useState([]);
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        if (order) {
            setFormData(order);
        }
    }, [order]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, statusesResponse, paymentsFormResponse, customersResponse] = await Promise.all([
                    ProductService.getAll(),
                    statusService.getStatuses(),
                    payment_formService.getPaymentForms(),
                    CustomerService.getAll(),
                ]);
                setProducts(productsResponse.data);
                setStatuses(statusesResponse);
                setPayment_forms(paymentsFormResponse);
                setCustomers(customersResponse.data.map(customer => ({
                    value: customer._id,
                    label: customer.fullname
                })));
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

    const handleCustomerChange = (selectedOption) => {
        setFormData({
            ...formData,
            id_customer: selectedOption ? selectedOption.value : '',
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

        // Check if there are no products
        if (formData.order_items.length === 0) {
            alert("Order must contain at least one product.");
            return;
        }

        // Check if any product fields are empty
        for (const item of formData.order_items) {
            if (!item.id_product || !item.quantity || !item.selling_price) {
                alert("All product fields must be filled.");
                return;
            }
        }

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
            // Update shipping_date if the next status is statuses[0] là đang giao
            if (currentIndex >= 0) {
                setFormData({
                    ...formData,
                    shipping_date: new Date().toISOString(),
                    status: nextStatus
                });
            }

        }
    };

    const handleCancelOrder = async (e) => {
        e.preventDefault();
        if (window.confirm("Bạn có chắc muốn hủy đơn hàng?")) {
            setFormData({
                ...formData,
                status: "Đã hủy"
            });
            try {
                const response = await OrderService.update(order._id, { ...formData, status: "Đã hủy" });
                onSave(response.data);
            } catch (error) {
                console.error('Error cancelling order:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={onClose} type="button">
                    <IoMdClose size={24}/>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên khách hàng:</label>
                    <Select
                        value={customers.find(option => option.value === formData.id_customer)}
                        onChange={handleCustomerChange}
                        options={customers}
                        isDisabled={!!order}
                        className="mt-1 block w-full"
                        placeholder="-- Chọn khách hàng --"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Staff ID:</label>
                    <input type="text" name="id_staff" value={formData.id_staff} onChange={handleChange} required
                           disabled={!!order}
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày tạo
                        đơn: {formatDateTime(formData.order_date)}</label>
                    <input type="hidden" name="order_date" value={formData.order_date}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày chuyển
                        hàng: {formatDateTime(formData.shipping_date)}</label>
                    <input type="hidden" name="shipping_date" value={formData.shipping_date}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán:</label>
                    <select name="form_payment" value={formData.form_payment} disabled={!!order} required
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">-- Chọn phương thức thanh toán --</option>
                        {payment_forms.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <input type="hidden" name="paymentform" value={formData.form_payment}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng tiền:</label>
                    <input type="number" step="0.01" name="total_price" value={formData.total_price} disabled
                           onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái: {formData.status}</label>
                </div>
            </div>
            <div className="flex justify-between">
                {formData.status !== "Đã hủy" && formData.status !== statuses[statuses.length - 1] && (
                    <Button type="button" onClick={handleNextStatus} className="bg-green-600 hover:bg-green-700">
                        {statuses[statuses.indexOf(formData.status) + 1] || "N/A"}
                    </Button>
                )}
                {!order && (
                    <Button onClick={addProduct} className="bg-blue-500 hover:bg-blue-600">
                        <IoMdAddCircleOutline size={24}/>
                    </Button>
                )}
            </div>

            <div>
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border">Sản phẩm</th>
                        <th className="py-2 px-4 border">Số lượng</th>
                        <th className="py-2 px-4 border">Giá bán</th>
                        <th className="py-2 px-4 border">Tổng cộng</th>
                        {!order && <th className="py-2 px-4 border">Hành động</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {formData.order_items.map((product, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border">
                                <select name="id_product" value={product.id_product}
                                        onChange={(e) => handleProductChange(index, e)} required
                                        disabled={!!order}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="">--Sản phẩm--</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="py-2 px-4 border">
                                <input type="number" name="quantity" value={product.quantity}
                                       onChange={(e) => handleProductChange(index, e)} required
                                       disabled={!!order}
                                       className="mt-1 block w-20 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                       placeholder="Quantity"/>
                            </td>
                            <td className="py-2 px-4 border">
                                <input type="text" name="selling_price" value={product.selling_price} disabled
                                       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                       placeholder="Selling Price"/>
                            </td>
                            <td className="py-2 px-4 border">
                                {product.quantity * product.selling_price}
                            </td>
                            {!order && (
                                <td className="py-2 px-4 border">
                                    <DeleteButton onClick={() => removeProduct(index)}
                                    >
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
                {order && formData.status === statuses[0] && (
                    <DeleteButton type="button" onClick={handleCancelOrder} className="mr-1"
                    >Hủy đơn
                    </DeleteButton>
                )}
                <Button type="submit">Lưu</Button>

            </div>
        </form>
    );
};

export default OrderForm;