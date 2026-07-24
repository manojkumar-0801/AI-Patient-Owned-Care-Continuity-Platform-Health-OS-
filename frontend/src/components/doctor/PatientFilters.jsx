import React from 'react';

export const PatientFilters = ({ filters, onChange }) => {
  
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  const handleClear = () => {
    onChange({ status: '', gender: '', sort: '' });
  };

  const hasActiveFilters = filters.status || filters.gender || filters.sort;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <select 
        name="status" 
        value={filters.status} 
        onChange={handleSelectChange}
        className="block w-full sm:w-auto py-2 px-3 border border-border bg-surface text-text-primary rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select 
        name="gender" 
        value={filters.gender} 
        onChange={handleSelectChange}
        className="block w-full sm:w-auto py-2 px-3 border border-border bg-surface text-text-primary rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      >
        <option value="">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <select 
        name="sort" 
        value={filters.sort} 
        onChange={handleSelectChange}
        className="block w-full sm:w-auto py-2 px-3 border border-border bg-surface text-text-primary rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      >
        <option value="">Sort By</option>
        <option value="name">Name (A-Z)</option>
        <option value="-name">Name (Z-A)</option>
        <option value="recent">Recently Added</option>
        <option value="last_visit">Last Visit</option>
      </select>

      {hasActiveFilters && (
        <button 
          onClick={handleClear}
          className="text-sm text-text-secondary hover:text-primary transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
