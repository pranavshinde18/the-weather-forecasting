import React, { useState, useEffect } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { fetchCities } from '../../api/OpenWeatherService';

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(savedHistory);
  }, []);

  const updateSearchHistory = (city) => {
    let updatedHistory = [city, ...searchHistory.filter((item) => item.label !== city.label)];
    if (updatedHistory.length > 5) updatedHistory.pop();
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const loadOptions = async (inputValue) => {
    const citiesList = await fetchCities(inputValue);
    return {
      options: citiesList.data.map((city) => ({
        value: `${city.latitude} ${city.longitude}`,
        label: `${city.name}, ${city.countryCode}`,
      })),
    };
  };

  const onChangeHandler = (enteredData) => {
    setSearchValue(enteredData);
    onSearchChange(enteredData);
    updateSearchHistory(enteredData);
  };

  return (
    <div>
      <AsyncPaginate
        placeholder="Search for cities"
        debounceTimeout={600}
        value={searchValue}
        onChange={onChangeHandler}
        loadOptions={loadOptions}
      />
      <div style={{ marginTop: '10px' }}>
        <strong>Search History:</strong>
        <ul>
          {searchHistory.map((city, index) => (
            <li key={index} style={{ cursor: 'pointer', color: 'blue' }} onClick={() => onChangeHandler(city)}>
              {city.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
