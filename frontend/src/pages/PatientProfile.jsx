import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import patientService from '../services/patientService';
import { 
  ArrowLeft, User, Phone, Shield, FileText, Activity, 
  Droplet, AlertCircle, Heart, CheckCircle2, Loader2, Edit3 
} from 'lucide-react';

export default function PatientProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demographics, setDemographics] = useState(null);
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch both demographics (/auth/me/) and medical profile (/patients/profile/) concurrently
        const [meRes, profileRes] = await Promise.all([
          patientService.getMe(),
          patientService.getPatientProfile()
        ]);
        
        if (meRes.success) setDemographics(meRes.data.profile);
        if (profileRes.success) setMedicalInfo(profileRes.data);
        
      } catch (err) {
        console.error("Failed to load profile data:", err);
        setError("Failed to load your profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Nav */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-slate-200">Patient Profile</h1>
            </div>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-sm font-medium rounded-lg transition-colors border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
          {/* Subtle gradient background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
            {demographics?.profile_photo ? (
              <img src={demographics.profile_photo} alt="Profile" className="h-full w-full object-cover rounded-2xl" />
            ) : (
              <span className="text-3xl font-bold text-white uppercase">{user?.first_name?.[0]}{user?.last_name?.[0]}</span>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{user?.full_name}</h2>
            <p className="text-emerald-400 font-medium mb-3">{medicalInfo?.patient_id || 'Patient'}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-sm text-slate-400">
              <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {user?.email}</span>
              {user?.phone_number && <span className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {user.phone_number}</span>}
            </div>
          </div>

          {user?.is_verified && (
            <div className="hidden sm:flex absolute top-6 right-6 items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified Account
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Demographics & Contact */}
          <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-slate-400" />
                Personal Details
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Gender</div>
                  <div className="font-medium text-slate-200">{demographics?.gender || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Date of Birth</div>
                  <div className="font-medium text-slate-200">
                    {demographics?.date_of_birth || 'Not specified'} 
                    {demographics?.age && <span className="text-slate-400 ml-2">({demographics.age} years)</span>}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-slate-400" />
                Emergency Contact
              </h3>
              <div className="space-y-4">
                {demographics?.emergency_name ? (
                  <>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Name (Relation)</div>
                      <div className="font-medium text-slate-200">
                        {demographics.emergency_name} 
                        {demographics.emergency_relation && <span className="text-slate-400"> ({demographics.emergency_relation})</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Phone Number</div>
                      <div className="font-medium text-slate-200">{demographics.emergency_phone || 'Not provided'}</div>
                    </div>
                    {demographics.emergency_alt_phone && (
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Alternate Phone</div>
                        <div className="font-medium text-slate-200">{demographics.emergency_alt_phone}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500 text-sm italic">No emergency contact provided.</p>
                )}
              </div>
            </section>
          </div>

          {/* Column 2: Health Info & Insurance */}
          <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Activity className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-rose-400" />
                Health Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-sm text-slate-500 flex items-center"><Droplet className="w-4 h-4 mr-2 text-red-400" /> Blood Type</div>
                  <div className="font-bold text-slate-200">{demographics?.blood_type || 'Unknown'}</div>
                </div>
                
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-sm text-slate-500 mb-2 flex items-center"><AlertCircle className="w-4 h-4 mr-2 text-amber-400" /> Allergies</div>
                  <div className="flex flex-wrap gap-2">
                    {demographics?.allergies?.length > 0 ? (
                      demographics.allergies.map((allergy, i) => (
                        <span key={i} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md text-sm">
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm">None reported</span>
                    )}
                  </div>
                </div>

                <div className="border-b border-slate-800 pb-3">
                  <div className="text-sm text-slate-500 mb-2 flex items-center"><Activity className="w-4 h-4 mr-2 text-cyan-400" /> Chronic Conditions</div>
                  <div className="flex flex-wrap gap-2">
                    {demographics?.chronic_conditions?.length > 0 ? (
                      demographics.chronic_conditions.map((condition, i) => (
                        <span key={i} className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md text-sm">
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm">None reported</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-2">Current Medications</div>
                  <div className="flex flex-wrap gap-2">
                    {demographics?.current_medications?.length > 0 ? (
                      demographics.current_medications.map((med, i) => (
                        <span key={i} className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md text-sm">
                          {med}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm">None</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-400" />
                Insurance & Identifiers
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">National Health ID</div>
                  <div className="font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 inline-block text-slate-300 text-sm">
                    {medicalInfo?.national_health_id || 'Not provided'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Insurance Provider</div>
                  <div className="font-medium text-slate-200">{medicalInfo?.insurance_provider || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Policy Number</div>
                  <div className="font-mono text-slate-300 text-sm">{medicalInfo?.insurance_policy_no || '-'}</div>
                </div>
                {medicalInfo?.insurance_expiry_date && (
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Expiry Date</div>
                    <div className="font-medium text-slate-200">{medicalInfo.insurance_expiry_date}</div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

      </main>
    </div>
  );
}
