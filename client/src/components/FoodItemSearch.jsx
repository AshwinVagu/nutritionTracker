import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useDebounce } from '../hooks/useDebounce';
import axiosServer from '../services/api';

// Functional component for a food item search input
const FoodItemSearch = (props) => {
    // Destructure props for better readability
    const { selectedOption, setSelectedOption, placeholder, style } = props;

    // State variables for search term, search results, and options for Select component
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [options, setOptions] = useState([]);

    // Effect hook to trigger a search when the search term changes
    useEffect(() => {
        // Check if there is a valid search term
        if (searchTerm && searchTerm.length > 0) {
            // Fetch food data based on the search term
            getFoodData(searchTerm);
        } else {
            // Reset search results and options if the search term is empty
            setSearchResults([]);
            setOptions([]);
        }
    }, [searchTerm]);

    // Function to fetch food data from the server based on the search term
    const getFoodData = async (search) => {
        try {
            const response = await axiosServer.get(`/food-items/get-food-data/${search}`, {
                headers: {
                    Accept: 'application/json',
                }
            });
            if (response) {
                // Extract data from the response
                const { data } = response;
                // Update search results and options based on the fetched data
                setSearchResults(data);
                setOptions(data.map((d, i) => ({ value: d.id, label: d.name })));
            }
        } catch (error) {
            console.log('Error!', error);
        }
    };

    // Event handler for search input changes
    const handleSearch = (value) => {
        // Update the search term
        setSearchTerm(value);
    }

    // Event handler for option selection in the Select component
    const handleChange = (newValue) => {
        // Find the selected option and update the state
        setSelectedOption(searchResults.find(e => e.id == newValue));
    };

    // Render the Select component for food item search
    return (
        <Select
            autoClearSearchValue={false}
            showSearch
            // Set the initial value based on the selected option or search term
            value={selectedOption?.name || searchTerm}
            placeholder={placeholder}
            style={style}
            // Remove the default search icon
            suffixIcon={null}
            // Event handler for search input changes
            onSearch={handleSearch}
            // Event handler for option selection
            onChange={handleChange}
            // Do not display "Not Found" content
            notFoundContent={null}
            // Display the available options
            options={options}
        />
    );
};

export { FoodItemSearch };