import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import patientService from '../services/patientService';
import { Activity, User, FileText, Calendar, Droplet, AlertCircle, Heart, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await patientService.getMe();
        if (response.success) {
          setProfile(response.data.profile);
        }
      } catch (error) {
        console.error('Failed to fetch patient profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Nav */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-emerald-400 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Health OS
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 hidden sm:flex">
                {profile?.profile_photo ? (
                  <img src={profile.profile_photo} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                )}
                <div className="text-sm text-slate-400">
                  <span className="text-slate-200 font-medium">{user?.email}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{user?.first_name || 'Patient'}</span>
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl">
            Here's an overview of your health profile and records today. Stay on top of your wellness journey.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Patient Information Summary */}
            <section>
              <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-slate-400" />
                Health Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center items-start">
                  <div className="flex items-center text-slate-400 mb-1 text-sm font-medium">
                    <User className="w-4 h-4 mr-1.5" /> Age
                  </div>
                  <div className="text-2xl font-bold text-slate-100">{profile?.age || '--'} yrs</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center items-start">
                  <div className="flex items-center text-red-400 mb-1 text-sm font-medium">
                    <Droplet className="w-4 h-4 mr-1.5" /> Blood Type
                  </div>
                  <div className="text-2xl font-bold text-slate-100">{profile?.blood_type || 'Unknown'}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center items-start">
                  <div className="flex items-center text-amber-400 mb-1 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 mr-1.5" /> Allergies
                  </div>
                  <div className="text-xl font-semibold text-slate-200 line-clamp-1">
                    {profile?.allergies?.length > 0 ? profile.allergies.join(', ') : 'None Reported'}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center items-start">
                  <div className="flex items-center text-rose-400 mb-1 text-sm font-medium">
                    <Heart className="w-4 h-4 mr-1.5" /> Conditions
                  </div>
                  <div className="text-xl font-semibold text-slate-200 line-clamp-1">
                    {profile?.chronic_conditions?.length > 0 ? profile.chronic_conditions.join(', ') : 'None'}
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Action Cards */}
            <section>
              <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-slate-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <Link to="/profile" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-300 group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                      <User className="w-6 h-6 text-emerald-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Patient Profile</h3>
                  <p className="text-sm text-slate-400 flex-grow">
                    Manage your personal information, contact details, and platform preferences.
                  </p>
                </Link>

                {/* Card 2 */}
                <Link to="/records" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/50 hover:bg-slate-800/50 transition-all duration-300 group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500/20 transition-all">
                      <FileText className="w-6 h-6 text-violet-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Medical Records</h3>
                  <p className="text-sm text-slate-400 flex-grow">
                    Access your uploaded documents, lab results, and generate secure sharing links.
                  </p>
                </Link>

                {/* Card 3 */}
                <Link to="/appointments" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                      <Calendar className="w-6 h-6 text-cyan-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Appointments</h3>
                  <p className="text-sm text-slate-400 flex-grow">
                    Schedule, reschedule, or view upcoming visits with your healthcare providers.
                  </p>
                </Link>

              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
