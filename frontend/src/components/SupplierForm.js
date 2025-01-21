import React, { useState } from 'react';
import SupplierService from "../services/supplier.service";

const SupplierForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''
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
            const response = await SupplierService.create(formData);
            // console.log('Supplier created:', response.data);
        } catch (error) {
            console.error('Error creating supplier:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <button type="submit" className="border-8 border-black">Create Supplier</button>
        </form>
    );
};

export default SupplierForm;