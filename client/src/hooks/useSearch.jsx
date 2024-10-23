// useSearch.js
import { useState, useMemo } from "react";

export const useSearch = (items = [], searchKeys = []) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    // Ensure items is an array and not undefined
    if (!Array.isArray(items)) return [];

    return items.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return value && value.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [items, searchKeys, searchTerm]);

  return { searchTerm, setSearchTerm, filteredItems };
};
