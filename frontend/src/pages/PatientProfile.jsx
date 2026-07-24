import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import patientService from '../services/patientService';
import { 
  User, Phone, Shield, FileText, 
  Edit3, Key, UploadCloud, Mail, Calendar, Activity, CheckCircle
} from 'lucide-react';
import { Button, Card, CardBody, Badge, Spinner, EmptyState } from '../components/ui';

export default function PatientProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demographics, setDemographics] = useState(null);
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [meRes, profileRes] = await Promise.all([
          patientService.getMe(),
          patientService.getPatientProfile()
        ]);
        
        if (meRes.success) setDemographics(meRes.data.profile);
        if (profileRes.success) setMedicalInfo(profileRes.data);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner size="lg" label="Loading Profile..." />
      </div>
    );
  }

  // Format dates for display
  const createdDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';
  const lastUpdated = user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Recently';

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      
      {/* Section 1: Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">Patient Profile</h1>
          <p className="text-text-secondary">
            Manage your personal information and emergency contacts.
          </p>
        </div>
        <div className="shrink-0">
          <Button 
            variant="primary" 
            iconLeft={Edit3}
            onClick={() => navigate('/profile/edit')}
          >
            Edit Profile
          </Button>
        </div>
      </section>

      {/* Section 2: Profile Summary Card */}
      <Card className="overflow-hidden">
        <CardBody className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            {demographics?.profile_photo ? (
              <img src={demographics.profile_photo} alt="Profile" loading="lazy" className="h-full w-full object-cover rounded-2xl" />
            ) : (
              <span className="text-4xl font-bold text-primary-foreground uppercase">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-1">{user?.full_name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge variant="primary" size="sm">ID: {medicalInfo?.patient_id || 'PENDING'}</Badge>
                  {user?.is_verified && <Badge variant="success" size="sm" icon={CheckCircle}>Verified</Badge>}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-text-secondary">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm truncate">{user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm">{user?.phone_number || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm">{demographics?.date_of_birth || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <User className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm capitalize">{demographics?.gender || 'N/A'}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 3: Personal Information */}
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Personal Information
            </h2>
            <Card>
              <CardBody className="p-0">
                <div className="divide-y divide-border">
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="text-sm text-text-muted font-medium min-w-[150px]">Full Name</span>
                    <span className="text-text-primary font-medium flex-1">{user?.full_name || 'N/A'}</span>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="text-sm text-text-muted font-medium min-w-[150px]">Email</span>
                    <span className="text-text-primary font-medium flex-1">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="text-sm text-text-muted font-medium min-w-[150px]">Phone Number</span>
                    <span className="text-text-primary font-medium flex-1">{user?.phone_number || 'N/A'}</span>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="text-sm text-text-muted font-medium min-w-[150px]">Date of Birth</span>
                    <span className="text-text-primary font-medium flex-1">{demographics?.date_of_birth || 'N/A'}</span>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="text-sm text-text-muted font-medium min-w-[150px]">Blood Group</span>
                    <span className="text-text-primary font-medium flex-1">{demographics?.blood_type || 'Unknown'}</span>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="text-sm text-text-muted font-medium min-w-[150px]">Gender</span>
                    <span className="text-text-primary font-medium flex-1 capitalize">{demographics?.gender || 'N/A'}</span>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <span className="text-sm text-text-muted font-medium min-w-[150px]">Address</span>
                    <span className="text-text-primary font-medium flex-1">{demographics?.address || 'No address provided'}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </section>

          {/* Section 4: Emergency Contact */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary flex items-center">
                <Shield className="w-5 h-5 mr-2 text-error" />
                Emergency Contact
              </h2>
              {demographics?.emergency_name && (
                <Button variant="outline" size="sm" onClick={() => navigate('/profile/edit')}>
                  Edit Contact
                </Button>
              )}
            </div>
            
            <Card>
              <CardBody className="p-0">
                {demographics?.emergency_name ? (
                  <div className="divide-y divide-border">
                    <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <span className="text-sm text-text-muted font-medium min-w-[150px]">Contact Name</span>
                      <span className="text-text-primary font-medium flex-1">{demographics.emergency_name}</span>
                    </div>
                    <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <span className="text-sm text-text-muted font-medium min-w-[150px]">Relationship</span>
                      <span className="text-text-primary font-medium flex-1">{demographics.emergency_relation || 'N/A'}</span>
                    </div>
                    <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <span className="text-sm text-text-muted font-medium min-w-[150px]">Phone Number</span>
                      <span className="text-text-primary font-medium flex-1">{demographics.emergency_phone || 'N/A'}</span>
                    </div>
                  </div>
                ) : (
                  <EmptyState 
                    icon={Shield}
                    title="No Emergency Contact" 
                    description="You haven't added an emergency contact yet. This is highly recommended for your safety."
                    actionText="Add Contact"
                    onAction={() => navigate('/profile/edit')}
                  />
                )}
              </CardBody>
            </Card>
          </section>
          
        </div>

        {/* Right Column (1/3 width) */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Section 6: Quick Actions */}
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Quick Actions
            </h2>
            <Card>
              <CardBody className="p-4 space-y-3">
                <Button 
                  fullWidth 
                  variant="outline" 
                  iconLeft={Edit3}
                  onClick={() => navigate('/profile/edit')}
                  className="justify-start"
                >
                  Edit Profile
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  iconLeft={Key}
                  className="justify-start"
                >
                  Change Password
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  iconLeft={FileText}
                  onClick={() => navigate('/records')}
                  className="justify-start"
                >
                  View Medical Records
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  iconLeft={UploadCloud}
                  onClick={() => navigate('/records')}
                  className="justify-start"
                >
                  Upload New Document
                </Button>
              </CardBody>
            </Card>
          </section>

          {/* Section 5: Account Information */}
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-text-secondary" />
              Account Information
            </h2>
            <Card>
              <CardBody className="p-0">
                <div className="divide-y divide-border">
                  <div className="p-4 flex flex-col gap-1">
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Account Status</span>
                    <div>
                      {user?.is_active !== false ? (
                        <Badge variant="success" size="sm">Active</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">Inactive</Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wider">User Role</span>
                    <span className="text-text-primary font-medium capitalize">{user?.role || 'Patient'}</span>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Account Created</span>
                    <span className="text-text-primary text-sm">{createdDate}</span>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Last Updated</span>
                    <span className="text-text-primary text-sm">{lastUpdated}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
