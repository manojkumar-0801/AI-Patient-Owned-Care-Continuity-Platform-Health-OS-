import React from 'react';
import { Button } from '../ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PatientPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-3 sm:px-6 rounded-md shadow-sm mt-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button 
          variant="outline" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-secondary">
            Page <span className="font-medium text-text-primary">{currentPage}</span> of <span className="font-medium text-text-primary">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              className="rounded-r-none border-r-0"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              iconLeft={ChevronLeft}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              className="rounded-l-none"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              iconRight={ChevronRight}
            >
              Next
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};
