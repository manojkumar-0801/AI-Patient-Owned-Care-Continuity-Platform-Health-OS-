import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../services/patientService';
import { 
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, Camera 
} from 'lucide-react';
import { Button, Input, Select, ThemeToggle } from '../components/ui';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Auth/Me Fields
    phone_number: '',
    gender: 'PREFER_NOT_TO_SAY',
    date_of_birth: '',
    blood_type: '',
    allergies: '',
    chronic_conditions: '',
    current_medications: '',
    emergency_name: '',
    emergency_phone: '',
    emergency_alt_phone: '',
    emergency_relation: '',
    
    // Patient Profile Fields
    national_health_id: '',
    insurance_provider: '',
    insurance_policy_no: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const [meRes, profileRes] = await Promise.all([
          patientService.getMe(),
          patientService.getPatientProfile()
        ]);
        
        const me = meRes.success ? meRes.data.profile : {};
        const base = meRes.success ? meRes.data : {};
        const prof = profileRes.success ? profileRes.data : {};

        setPhotoPreview(me.profile_photo || null);

        setFormData({
          phone_number: base.phone_number || '',
          gender: me.gender || 'PREFER_NOT_TO_SAY',
          date_of_birth: me.date_of_birth || '',
          blood_type: me.blood_type || '',
          allergies: (me.allergies || []).join(', '),
          chronic_conditions: (me.chronic_conditions || []).join(', '),
          current_medications: (me.current_medications || []).join(', '),
          emergency_name: me.emergency_name || '',
          emergency_phone: me.emergency_phone || '',
          emergency_alt_phone: me.emergency_alt_phone || '',
          emergency_relation: me.emergency_relation || '',
          national_health_id: prof.national_health_id || '',
          insurance_provider: prof.insurance_provider || '',
          insurance_policy_no: prof.insurance_policy_no || '',
        });
      } catch (err) {
        console.error("Failed to load profile data:", err);
        setError("Failed to load your profile data for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      // Split arrays properly for array fields
      const parseList = (str) => str ? str.split(',').map(s => s.trim()).filter(s => s) : [];

      const meUpdate = {
        phone_number: formData.phone_number,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        blood_type: formData.blood_type || '',
        allergies: parseList(formData.allergies),
        chronic_conditions: parseList(formData.chronic_conditions),
        current_medications: parseList(formData.current_medications),
        emergency_name: formData.emergency_name,
        emergency_phone: formData.emergency_phone,
        emergency_alt_phone: formData.emergency_alt_phone,
        emergency_relation: formData.emergency_relation,
      };

      const profUpdate = {
        national_health_id: formData.national_health_id,
        insurance_provider: formData.insurance_provider,
        insurance_policy_no: formData.insurance_policy_no,
      };

      // Execute PATCH concurrently
      await Promise.all([
        patientService.updateMe(meUpdate),
        patientService.updatePatientProfile(profUpdate)
      ]);

      setSuccess("Profile updated successfully!");
      
      // Redirect after brief delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (err) {
      console.error("Failed to update profile:", err);
      // Try to extract exact API validation error
      let errorMsg = "An error occurred while updating your profile. Please check the data and try again.";
      if (err.response?.data?.error?.details) {
        const details = err.response.data.error.details;
        const keys = Object.keys(details);
        if (keys.length > 0) {
          errorMsg = `${keys[0]}: ${details[keys[0]][0]}`;
        }
      }
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-text-secondary">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-primary/30 selection:text-primary pb-12">
      {/* Top Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile')}
                className="mr-4 hover:bg-surface-hover"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-text-primary">Edit Profile</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-error/10 border border-error/50 text-error px-4 py-3 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-success/10 border border-success/50 text-success px-4 py-3 rounded-xl flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Profile Photo Upload Section */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-background flex items-center justify-center overflow-hidden border-2 border-border">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-text-muted" />
              )}
            </div>
            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
              <Camera className="w-6 h-6 text-white" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    setError("Image must be smaller than 5MB");
                    return;
                  }
                  setPhotoPreview(URL.createObjectURL(file));
                  setPhotoFile(file);
                  
                  // Upload immediately
                  try {
                    setUploadingPhoto(true);
                    setError(null);
                    const res = await patientService.uploadProfilePhoto(file);
                    setSuccess("Profile photo updated successfully!");
                    if (res.profile_photo) {
                       setPhotoPreview(res.profile_photo);
                    }
                  } catch (err) {
                    setError("Failed to upload profile photo.");
                    setPhotoPreview(null);
                  } finally {
                    setUploadingPhoto(false);
                  }
                }}
              />
            </label>
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary">Profile Picture</h3>
            <p className="text-sm text-text-secondary mt-1">Upload a new avatar. Max size 5MB.</p>
            {uploadingPhoto && <p className="text-sm text-primary mt-2 flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Demographics */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6 border-b border-border pb-2">Personal & Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Phone Number"
                type="text" 
                name="phone_number" 
                value={formData.phone_number} 
                onChange={handleChange}
                placeholder="+1234567890"
              />

              <div className="relative flex flex-col w-full">
                <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-text-muted transition-all duration-300"
                >
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <Input 
                label="Date of Birth"
                type="date" 
                name="date_of_birth" 
                value={formData.date_of_birth} 
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
              />

              <div className="relative flex flex-col w-full">
                <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Blood Type</label>
                <select 
                  name="blood_type" 
                  value={formData.blood_type} 
                  onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 hover:border-text-muted transition-all duration-300"
                >
                  <option value="">Unknown</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Medical Information */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6 border-b border-border pb-2">Medical Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <Input 
                label="Allergies (comma separated)"
                type="text" 
                name="allergies" 
                value={formData.allergies} 
                onChange={handleChange}
                placeholder="e.g. Peanuts, Penicillin"
              />

              <Input 
                label="Chronic Conditions (comma separated)"
                type="text" 
                name="chronic_conditions" 
                value={formData.chronic_conditions} 
                onChange={handleChange}
                placeholder="e.g. Hypertension, Asthma"
              />

              <Input 
                label="Current Medications (comma separated)"
                type="text" 
                name="current_medications" 
                value={formData.current_medications} 
                onChange={handleChange}
                placeholder="e.g. Lisinopril 10mg, Albuterol"
              />
            </div>
          </div>

          {/* Section 3: Emergency Contact & Insurance */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6 border-b border-border pb-2">Emergency Contact & Insurance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <Input 
                label="Emergency Contact Name"
                type="text" 
                name="emergency_name" 
                value={formData.emergency_name} 
                onChange={handleChange}
              />

              <Input 
                label="Emergency Contact Phone"
                type="text" 
                name="emergency_phone" 
                value={formData.emergency_phone} 
                onChange={handleChange}
              />

              <Input 
                label="Alternate Phone (Optional)"
                type="text" 
                name="emergency_alt_phone" 
                value={formData.emergency_alt_phone} 
                onChange={handleChange}
              />

              <Input 
                label="Emergency Contact Relation"
                type="text" 
                name="emergency_relation" 
                value={formData.emergency_relation} 
                onChange={handleChange}
                placeholder="e.g. Spouse, Parent"
              />

              <div className="md:col-span-2 mt-4 mb-2 border-t border-border"></div>

              <Input 
                label="National Health ID"
                type="text" 
                name="national_health_id" 
                value={formData.national_health_id} 
                onChange={handleChange}
                className="font-mono"
              />

              <Input 
                label="Insurance Provider"
                type="text" 
                name="insurance_provider" 
                value={formData.insurance_provider} 
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <Input 
                  label="Insurance Policy Number"
                  type="text" 
                  name="insurance_policy_no" 
                  value={formData.insurance_policy_no} 
                  onChange={handleChange}
                  className="font-mono"
                />
              </div>

            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={saving}
              isLoading={saving}
              iconLeft={Save}
              className="shadow-lg shadow-success/20"
            >
              Save Changes
            </Button>
          </div>

        </form>
      </main>
    </div>
  );
}
