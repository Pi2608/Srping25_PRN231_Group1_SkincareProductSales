import React, { useState } from 'react';
import './SearchBox.css';

const SearchBox = ({ onChange, onSearch }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (onChange) {
            onChange(value);
        }
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    return (
        <div id="search_box">
            <input
                type="text"
                value={searchValue}
                onChange={handleChange}
                placeholder="Find Product"
                className="search-input"
            />
            <button onClick={()=>handleSearch()}>Search</button>
        </div>
    );
};

export default SearchBox;
