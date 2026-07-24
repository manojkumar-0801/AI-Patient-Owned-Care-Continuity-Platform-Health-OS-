import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import recordService from '../services/recordService';
import { 
  ArrowLeft, FileText, Calendar, Clock, Building,
  Stethoscope, File, Download, Trash2, Edit3, AlertCircle, Upload, Sparkles
} from 'lucide-react';
import { Button, Input, Select, Textarea, Card, CardBody, Badge, Spinner } from '../components/ui';

const CATEGORY_LABELS = {
  'LAB_REPORT': 'Lab Report',
  'PRESCRIPTION': 'Prescription',
  'RADIOLOGY': 'Radiology / Imaging',
  'DISCHARGE_SUMMARY': 'Discharge Summary',
  'VACCINATION': 'Vaccination',
  'DENTAL': 'Dental',
  'OPHTHALMOLOGY': 'Ophthalmology',
  'CARDIOLOGY': 'Cardiology',
  'OTHER': 'Other'
};

export default function MedicalRecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    title: '', category: '', document_date: '', provider_name: '', description: ''
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await recordService.getDocument(id);
        if (res.success) {
          setDoc(res.data);
        } else {
          setError("Failed to load document details.");
        }
      } catch (err) {
        setError("Error connecting to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await recordService.downloadDocument(id);
      if (res.success && res.data.download_url) {
        window.open(res.data.download_url, '_blank');
      }
    } catch (err) {
      alert("Failed to get download link.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await recordService.deleteDocument(id);
      navigate('/records');
    } catch (err) {
      alert("Failed to delete document.");
    }
  };

  const handleEditClick = () => {
    setEditData({
      title: doc.title || '',
      category: doc.category || 'OTHER',
      document_date: doc.document_date || '',
      provider_name: doc.provider_name || '',
      description: doc.description || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await recordService.updateDocument(id, editData);
      if (res.success) {
        setDoc(res.data);
        setIsEditing(false);
      } else {
        alert("Failed to update document.");
      }
    } catch (err) {
      alert("Error updating document.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner size="lg" label="Loading Document Details..." />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <div className="bg-error/10 border border-error/50 text-error px-6 py-4 rounded-xl flex items-center mb-6">
          <AlertCircle className="w-6 h-6 mr-3" />
          <p>{error || "Document not found"}</p>
        </div>
        <Button variant="outline" iconLeft={ArrowLeft} onClick={() => navigate('/records')}>
          Back to Records
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      
      {/* Navigation & Actions Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Button variant="ghost" iconLeft={ArrowLeft} onClick={() => navigate('/records')} className="-ml-4 text-text-secondary">
            Back to Records
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" iconLeft={Download} onClick={handleDownload}>
            Download
          </Button>
          <Button variant="outline" iconLeft={Edit3} onClick={handleEditClick}>
            Edit
          </Button>
          <Button variant="danger" iconLeft={Trash2} onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </section>

      {isEditing ? (
        <Card className="shadow-lg border-primary/20">
          <CardBody className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
              <Edit3 className="w-6 h-6 mr-3 text-primary" />
              Edit Medical Record
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Title *" type="text" required value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-text-secondary ml-1">Category *</label>
                <Select value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})}>
                  {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </Select>
              </div>
              <Input label="Document Date" type="date" value={editData.document_date} onChange={(e) => setEditData({...editData, document_date: e.target.value})} />
              <Input label="Provider / Clinic" type="text" value={editData.provider_name} onChange={(e) => setEditData({...editData, provider_name: e.target.value})} />
            </div>
            <div className="mt-6">
              <Textarea label="Description / Notes" rows="3" value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} />
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={!editData.title} isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Section 5: Document Information Header */}
          <Card className="overflow-hidden">
            <CardBody className="p-6 md:p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-text-primary mb-3 tracking-tight">{doc.title}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="primary">
                      {CATEGORY_LABELS[doc.category] || doc.category}
                    </Badge>
                  </div>
                </div>
              </div>
              {doc.description && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wider">Notes</h3>
                  <p className="text-text-primary leading-relaxed bg-surface-hover p-4 rounded-xl border border-border">
                    {doc.description}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Provider Information */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-primary" /> 
                  Provider Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center mr-4 mt-0.5 border border-border">
                      <Building className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Hospital / Clinic</p>
                      <p className="text-lg font-semibold text-text-primary">{doc.provider_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center mr-4 mt-0.5 border border-border">
                      <Stethoscope className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Provider Type</p>
                      <p className="text-lg font-semibold text-text-primary">{doc.provider_type || 'General'}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            {/* Dates */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" /> 
                  Timeline
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center mr-4 mt-0.5 border border-border">
                      <Calendar className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Document Date</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {doc.document_date ? new Date(doc.document_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center mr-4 mt-0.5 border border-border">
                      <Upload className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Uploaded Date</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {new Date(doc.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* File Details */}
            <Card className="md:col-span-2">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                  <File className="w-5 h-5 mr-2 text-primary" /> 
                  File Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-background rounded-2xl p-4 border border-border">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">File Name</p>
                    <p className="text-sm font-semibold text-text-secondary truncate" title={doc.file_original_name}>
                      {doc.file_original_name || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-background rounded-2xl p-4 border border-border">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">File Type</p>
                    <p className="text-sm font-semibold text-text-secondary">
                      {doc.file_type || 'Unknown'}
                    </p>
                  </div>
                  <div className="bg-background rounded-2xl p-4 border border-border">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">File Size</p>
                    <p className="text-sm font-semibold text-text-secondary">
                      {doc.file_size_bytes ? `${(doc.file_size_bytes / (1024 * 1024)).toFixed(2)} MB` : '0 MB'}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Extracted Text (OCR) */}
            <Card className="md:col-span-2">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" /> 
                  Extracted Text (OCR)
                </h2>
                <div className="bg-background rounded-2xl p-6 border border-border">
                  {doc.extracted_text ? (
                    <pre className="text-sm font-medium text-text-secondary whitespace-pre-wrap max-h-96 overflow-y-auto font-sans leading-relaxed">
                      {doc.extracted_text}
                    </pre>
                  ) : (
                    <p className="text-sm font-medium text-text-muted italic text-center py-4">
                      No extracted text available.
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* AI Summary */}
            <Card className="md:col-span-2">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" /> 
                  AI Summary
                </h2>
                <div className="bg-background rounded-2xl p-6 border border-border">
                  {doc.ai_summary ? (
                    <pre className="text-sm font-medium text-text-secondary whitespace-pre-wrap max-h-96 overflow-y-auto font-sans leading-relaxed">
                      {doc.ai_summary}
                    </pre>
                  ) : (
                    <p className="text-sm font-medium text-text-muted italic text-center py-4">
                      AI summary not available.
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>


          </div>
        </>
      )}

      {/* Section 8: Delete Confirmation */}
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
                Are you sure you want to delete <span className="font-semibold text-text-primary">"{doc?.title}"</span>? This action cannot be undone.
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
