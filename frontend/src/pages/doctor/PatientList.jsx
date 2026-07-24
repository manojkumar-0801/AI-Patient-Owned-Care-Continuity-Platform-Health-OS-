import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import { Spinner, EmptyState, Button } from '../../components/ui';
import { Users, RefreshCw } from 'lucide-react';
import { PatientSearch } from '../../components/doctor/PatientSearch';
import { PatientFilters } from '../../components/doctor/PatientFilters';
import { PatientCard } from '../../components/doctor/PatientCard';
import { PatientPagination } from '../../components/doctor/PatientPagination';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Count state
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    gender: '',
    sort: '-last_visit' // default sort
  });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // doctorService.getPatients expects standard params, map them to DRF pagination params
      const params = {
        search: searchQuery,
        status: filters.status,
        gender: filters.gender,
        sort: filters.sort,
        page: currentPage
      };
      
      const response = await doctorService.getPatients(params);
      
      // Handle standard paginated response vs unpaginated array
      if (response && response.results !== undefined) {
        setPatients(response.results);
        setTotalPatients(response.count);
        // Assuming 12 items per page based on DRF settings in views.py
        setTotalPages(Math.ceil(response.count / 12));
      } else if (Array.isArray(response)) {
        setPatients(response);
        setTotalPatients(response.length);
        setTotalPages(1);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error("Failed to load patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // reset to page 1 on search
  };

  const hasActiveFilters = searchQuery || filters.status || filters.gender;

  return (
    <div className="space-y-6 pb-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Patient List</h1>
          <p className="text-text-secondary mt-1">
            Search and manage patients assigned to your care. ({totalPatients} total)
          </p>
        </div>
        <Button 
          variant="outline" 
          iconLeft={RefreshCw} 
          onClick={fetchPatients}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* 2 & 3. Search Bar and Filter Panel */}
      <div className="bg-surface p-4 rounded-lg shadow-sm border border-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <PatientSearch value={searchQuery} onChange={handleSearchChange} />
        <PatientFilters filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" label="Loading patients..." />
        </div>
      ) : (
        <>
          {/* 4. Patient List Display */}
          {patients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map(patient => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          ) : (
            /* 7. Empty State */
            <div className="bg-surface rounded-lg p-12 border border-border mt-6">
              <EmptyState 
                icon={Users}
                title="No patients found."
                description={hasActiveFilters ? "Try adjusting your search or filters." : "You do not have any patients assigned to your care yet."}
                action={hasActiveFilters ? (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setFilters({ status: '', gender: '', sort: '' });
                  }}>
                    Reset Filters
                  </Button>
                ) : null}
              />
            </div>
          )}
          
          {/* 6. Pagination */}
          {patients.length > 0 && (
            <PatientPagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          )}
        </>
      )}
    </div>
  );
}
