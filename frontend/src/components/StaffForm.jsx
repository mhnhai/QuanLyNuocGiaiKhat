import React, { useState, useEffect } from "react";
import StaffService from "../services/staff.service";

const StaffForm = ({ staff, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        salary: '',
    });

    useEffect(() => {
        if (staff) {
            setFormData(staff);
        }
    }, [staff]);

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
            if (staff) {
                response = await StaffService.update(staff._id, formData);
            } else {
                response = await StaffService.create(formData);
            }
            onSave(response.data);
        } catch (error) {
            console.error('Error saving staff:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">position:</label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">salary:</label>
                    <input type="text" name="salary" value={formData.salary} onChange={handleChange} required
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

export default StaffForm;