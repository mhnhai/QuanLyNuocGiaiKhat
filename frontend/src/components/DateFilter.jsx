import React from 'react';

const DateFilter = ({ onFilter }) => {
    const handleChange = (e) => {
        onFilter(e.target.value);
    };

    return (
        <input
            type="date"
            onChange={handleChange}
            className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    );
};

export default DateFilter;