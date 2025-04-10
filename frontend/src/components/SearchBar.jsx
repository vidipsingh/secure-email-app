import React from 'react';

function SearchBar({ onSearch, onFilter }) {
  return (
    <div className="mb-6 flex gap-4">
      <input
        type="text"
        placeholder="Search emails..."
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
      />
      <select
        onChange={(e) => onFilter(e.target.value)}
        className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
      >
        <option value="all">All</option>
        <option value="with-attachments">With Attachments</option>
      </select>
    </div>
  );
}

export default SearchBar;