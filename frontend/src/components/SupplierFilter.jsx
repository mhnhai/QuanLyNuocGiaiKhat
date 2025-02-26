import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import SupplierService from '../services/supplier.service';

const SupplierFilter = ({ onFilter }) => {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
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

    const handleChange = (selectedOption) => {
        onFilter(selectedOption ? selectedOption.value : '');
    };

    return (
        <Select
            options={suppliers}
            onChange={handleChange}
            isClearable
            placeholder="-- Chọn nhà cung cấp --"
            className="w-64"
        />
    );
};

export default SupplierFilter;