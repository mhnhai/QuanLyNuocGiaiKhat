import React from 'react';

const DateFilter = ({ onFilter }) => {
    const handleChange = (e) => {
        onFilter(e.target.value);
    };

    return (
        <input
            type="date"
            onChange={handleChange}
            className="input"
        />
    );
};

export default DateFilter;