import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, activeCategory, setActiveCategory }}>
      {children}
    </SearchContext.Provider>
  );
};
