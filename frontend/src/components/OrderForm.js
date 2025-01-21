import React, { useState } from 'react';
import OrderService from "../services/order.service";

const OrderForm = () => {
    const [formData, setFormData] = useState({
        id_customer: '',
        id_staff: '',
        order_date: '',
        shipping_date: '',
        form_payment: '',
        total_price: '',
        status: ''
    });

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
            const response = await OrderService.create(formData);
            // console.log('Order created:', response.data);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Customer ID:</label>
                <input type="text" name="id_customer" value={formData.id_customer} onChange={handleChange} required />
            </div>
            <div>
                <label>Staff ID:</label>
                <input type="text" name="id_staff" value={formData.id_staff} onChange={handleChange} required />
            </div>
            <div>
                <label>Order Date:</label>
                <input type="date" name="order_date" value={formData.order_date} onChange={handleChange} required />
            </div>
            <div>
                <label>Shipping Date:</label>
                <input type="date" name="shipping_date" value={formData.shipping_date} onChange={handleChange} required />
            </div>
            <div>
                <label>Form of Payment:</label>
                <input type="text" name="form_payment" value={formData.form_payment} onChange={handleChange} required />
            </div>
            <div>
                <label>Total Price:</label>
                <input type="number" step="0.01" name="total_price" value={formData.total_price} onChange={handleChange} required />
            </div>
            <div>
                <label>Status:</label>
                <input type="text" name="status" value={formData.status} onChange={handleChange} required />
            </div>
            <button type="submit" className="border-8 border-black">Create Order</button>
        </form>
    );
};

export default OrderForm;