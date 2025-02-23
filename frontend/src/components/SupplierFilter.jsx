import React, { useState, useEffect } from 'react';
import SupplierService from '../services/supplier.service';

const SupplierFilter = ({ onFilter }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');

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
        const newSupplier = e.target.value;
        setSelectedSupplier(newSupplier);
        onFilter(newSupplier);
    };

    const handleClear = () => {
        setSelectedSupplier('');
        onFilter('');
    };

    return (
        <div className="flex flex-col w-96">
            <div className="flex">
                <select
                    value={selectedSupplier}
                    onChange={handleChange}
                    className="flex-grow px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Tất cả</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleClear}
                    className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SupplierFilter;