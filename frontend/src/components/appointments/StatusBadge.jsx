import React from 'react';

const statusConfig = {
  'REQUESTED': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
  'CONFIRMED': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Confirmed' },
  'IN_PROGRESS': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'In Progress' },
  'COMPLETED': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Completed' },
  'CANCELLED': { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
  'NO_SHOW': { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'No Show' }
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: status };
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};
