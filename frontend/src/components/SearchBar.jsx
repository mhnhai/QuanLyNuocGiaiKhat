import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        onSearch(newSearchTerm);
    };

    return (
        <div className="flex w-80 shadow-lg">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Tìm kiếm..."
                className="input input-md w-80"
            />
        </div>
    );
};

export default SearchBar;