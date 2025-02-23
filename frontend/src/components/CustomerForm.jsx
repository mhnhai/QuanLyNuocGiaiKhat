import React, { useState, useEffect } from 'react';
import CustomerService from '../services/customer.service';

const CustomerForm = ({ customer, onSave }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        address: '',
        phone: ''
    });

    useEffect(() => {
        if (customer) {
            setFormData(customer);
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (customer) {
                response = await CustomerService.update(customer._id, formData);
            } else {
                response = await CustomerService.create(formData);
            }
            onSave(response.data);
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên:</label>
                    <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
            </div>
            <button type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save
                Staff
            </button>
        </form>
    );
};

export default CustomerForm;