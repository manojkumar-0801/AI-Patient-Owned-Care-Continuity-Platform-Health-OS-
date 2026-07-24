import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import recordService from '../services/recordService';
import { 
  FileText, Upload, Calendar, Trash2, Download, Plus, 
  Search, Eye, X, Building, Clock, AlertCircle
} from 'lucide-react';
import { Button, Input, Select, Textarea, Card, CardBody, Badge, Spinner, EmptyState } from '../components/ui';

const CATEGORIES = [
  { value: 'LAB_REPORT', label: 'Lab Report' },
  { value: 'PRESCRIPTION', label: 'Prescription' },
  { value: 'RADIOLOGY', label: 'Radiology / Imaging' },
  { value: 'DISCHARGE_SUMMARY', label: 'Discharge Summary' },
  { value: 'VACCINATION', label: 'Vaccination' },
  { value: 'DENTAL', label: 'Dental' },
  { value: 'OPHTHALMOLOGY', label: 'Ophthalmology' },
  { value: 'CARDIOLOGY', label: 'Cardiology' },
  { value: 'OTHER', label: 'Other' }
];

export default function MedicalRecords() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for document list
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('-document_date');
  const [pagination, setPagination] = useState({ page: 1, hasNext: false, hasPrev: false });

  // State for upload form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [formData, setFormData] = useState({
    title: '', category: 'LAB_REPORT', document_date: '', provider_name: '', description: ''
  });

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const fetchDocuments = async (page = 1, search = searchQuery, category = selectedCategory, ordering = selectedSort) => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = { page };
      if (search) params.search = search;
      if (category) params.category = category;
      if (ordering) params.ordering = ordering;

      const res = await recordService.getDocuments(params);
      if (res.success) {
        setDocuments(res.data);
        setPagination({
          page,
          hasNext: !!res.next,
          hasPrev: !!res.previous
        });
      } else {
        setFetchError("Failed to fetch documents.");
      }
    } catch (err) {
      setFetchError("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocuments(1, searchQuery, selectedCategory, selectedSort);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    fetchDocuments(1, searchQuery, e.target.value, selectedSort);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    fetchDocuments(1, searchQuery, selectedCategory, e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSort('-document_date');
    fetchDocuments(1, '', '', '-document_date');
  };

  const handlePageChange = (newPage) => {
    fetchDocuments(newPage, searchQuery, selectedCategory, selectedSort);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size cannot exceed 10MB.");
      setFileToUpload(null);
      e.target.value = null;
      return;
    }
    
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
      setUploadError("Unsupported file extension. Allowed extensions are PDF, JPG, JPEG, PNG.");
      setFileToUpload(null);
      e.target.value = null;
      return;
    }
    
    setUploadError(null);
    setFileToUpload(file);
    if (!formData.title) {
      setFormData(prev => ({ ...prev, title: file.name.split('.')[0] }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileToUpload || !formData.title) {
      setUploadError("Please provide a file and a title.");
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    
    const data = new FormData();
    data.append('file', fileToUpload);
    data.append('title', formData.title);
    data.append('category', formData.category);
    if (formData.document_date) data.append('document_date', formData.document_date);
    if (formData.provider_name) data.append('provider_name', formData.provider_name);
    if (formData.description) data.append('description', formData.description);
    
    try {
      const res = await recordService.uploadDocument(data);
      if (res.success) {
        setFileToUpload(null);
        setFormData({ title: '', category: 'LAB_REPORT', document_date: '', provider_name: '', description: '' });
        setShowUploadModal(false);
        fetchDocuments();
      } else {
        setUploadError(res.message || "Failed to upload document.");
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      setFetchError(null);
      const res = await recordService.downloadDocument(doc.id);
      if (res.success && res.data.download_url) {
        window.open(res.data.download_url, '_blank');
      } else {
        setFetchError("Failed to get download link.");
      }
    } catch (err) {
      setFetchError("Failed to get download link.");
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    setFetchError(null);
    try {
      await recordService.deleteDocument(recordToDelete.id);
      setDocuments(docs => docs.filter(d => d.id !== recordToDelete.id));
      setShowDeleteModal(false);
      setRecordToDelete(null);
    } catch (err) {
      setShowDeleteModal(false);
      setRecordToDelete(null);
      setFetchError("Failed to delete document.");
    }
  };

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      
      {/* Section 1: Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-primary" />
            Medical Records
          </h1>
          <p className="text-text-secondary">
            Manage and access all your medical documents in one place.
          </p>
        </div>
        <div className="shrink-0">
          <Button 
            variant="primary" 
            iconLeft={Plus}
            onClick={() => {
              setShowUploadModal(true);
              setUploadError(null);
            }}
          >
            Upload Medical Record
          </Button>
        </div>
      </section>

      {/* Section 2: Search & Filters */}
      <section className="bg-surface border border-border rounded-2xl p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-text-secondary" />
              </div>
              <input
                type="text"
                placeholder="Search by title, provider, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </div>
          <div className="w-full md:w-56">
            <Select value={selectedSort} onChange={handleSortChange}>
              <option value="-created_at">Newest Uploaded</option>
              <option value="created_at">Oldest Uploaded</option>
              <option value="-document_date">Newest Doc Date</option>
              <option value="document_date">Oldest Doc Date</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="-title">Alphabetical (Z-A)</option>
            </Select>
          </div>
          <div className="flex items-center shrink-0 w-full md:w-auto">
            <Button type="button" variant="outline" onClick={clearFilters} className="w-full md:w-auto">
              Clear Filters
            </Button>
          </div>
        </form>
      </section>

      {/* Section 3 & 6: Records Display or Empty State */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" label="Loading Records..." />
          </div>
        ) : fetchError ? (
          <div className="bg-error/10 border border-error/50 text-error px-6 py-4 rounded-xl flex items-center">
            <AlertCircle className="w-6 h-6 mr-3" />
            <p>{fetchError}</p>
          </div>
        ) : documents.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No Medical Records" 
            description={searchQuery || selectedCategory ? "No records match your filters." : "Upload your first medical record to get started."}
            actionText={searchQuery || selectedCategory ? "Clear Filters" : "Upload Document"}
            onAction={searchQuery || selectedCategory ? clearFilters : () => setShowUploadModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
                <CardBody className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3 w-full overflow-hidden">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary line-clamp-1" title={doc.title}>{doc.title}</h3>
                        <div className="mt-1">
                          <Badge variant="secondary" size="sm">
                            {CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2 mb-6">
                    <div className="flex items-center text-sm text-text-secondary">
                      <Building className="w-4 h-4 mr-2 text-text-muted shrink-0" />
                      <span className="truncate">{doc.provider_name || 'No provider specified'}</span>
                    </div>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Calendar className="w-4 h-4 mr-2 text-text-muted shrink-0" />
                      <span>Doc Date: {doc.document_date ? new Date(doc.document_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Clock className="w-4 h-4 mr-2 text-text-muted shrink-0" />
                      <span>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border">
                    <Button variant="outline" size="sm" iconLeft={Eye} onClick={() => navigate(`/records/${doc.id}`)}>
                      View
                    </Button>
                    <Button variant="outline" size="sm" iconLeft={Download} onClick={() => handleDownload(doc)}>
                      Download
                    </Button>
                    <div className="flex-1"></div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setRecordToDelete(doc); setShowDeleteModal(true); }} 
                      className="text-text-secondary hover:text-error hover:bg-error/10"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && documents.length > 0 && (pagination.hasNext || pagination.hasPrev) && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="outline" onClick={() => handlePageChange(pagination.page - 1)} disabled={!pagination.hasPrev}>
              Previous
            </Button>
            <span className="text-text-secondary text-sm font-medium">Page {pagination.page}</span>
            <Button variant="outline" onClick={() => handlePageChange(pagination.page + 1)} disabled={!pagination.hasNext}>
              Next
            </Button>
          </div>
        )}
      </section>

      {/* Section 4: Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h2 className="text-xl font-bold text-text-primary flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-primary" />
                  Upload Medical Record
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {uploadError && (
                <div className="mb-6 bg-error/10 border border-error/50 text-error px-4 py-3 rounded-xl flex items-center">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <p className="text-sm">{uploadError}</p>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-6">
                {/* Drag & Drop Visual Area */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Document File *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-xl bg-background hover:border-primary/50 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-text-muted" />
                      <div className="flex text-sm text-text-secondary justify-center mt-4">
                        <label className="relative cursor-pointer bg-surface rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary px-4 py-2 border border-border">
                          <span>Select a file from your device</span>
                          <input name="file" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                        </label>
                      </div>
                      <p className="text-xs text-text-muted mt-2">PDF, JPG, PNG up to 10MB</p>
                      {fileToUpload && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg flex items-center justify-center gap-2 text-primary">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-semibold truncate max-w-[200px]">{fileToUpload.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Title *" type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Blood Test Results" />
                  <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium text-text-secondary ml-1">Category *</label>
                    <Select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </Select>
                  </div>
                  <Input label="Document Date" type="date" value={formData.document_date} onChange={(e) => setFormData({...formData, document_date: e.target.value})} />
                  <Input label="Provider / Clinic" type="text" value={formData.provider_name} onChange={(e) => setFormData({...formData, provider_name: e.target.value})} placeholder="e.g. City Hospital" />
                </div>
                
                <Textarea label="Description / Notes" rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Add any additional context..." />

                <div className="flex justify-end gap-3 pt-6 border-t border-border">
                  <Button variant="outline" type="button" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={!fileToUpload} isLoading={uploading} iconLeft={Upload}>
                    Upload Document
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Section 8: Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-error/20">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                  <Trash2 className="h-6 w-6 text-error" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">Delete Medical Record?</h3>
                </div>
              </div>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete <span className="font-semibold text-text-primary">"{recordToDelete?.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

    </div>
  );
}
