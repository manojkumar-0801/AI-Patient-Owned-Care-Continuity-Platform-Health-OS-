import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import patientService from '../services/patientService';
import { Link } from 'react-router-dom';
import DoctorDashboard from './doctor/DoctorDashboard';
import { 
  FileText, 
  Calendar, 
  Users, 
  Brain, 
  Upload, 
  User, 
  Droplet,
  Clock
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardBody, 
  Badge,
  Spinner
} from '../components/ui';

export default function Dashboard() {
  const { user } = useAuth();
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

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Spinner size="lg" label="Loading Dashboard..." />
      </div>
    );
  }

  if (user?.role === 'DOCTOR') {
    return <DoctorDashboard />;
  }

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      
      {/* Section 1: Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{currentDate}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Welcome back, <span className="text-primary">{user?.first_name || 'Patient'}</span> 👋
          </h1>
          <p className="mt-2 text-text-secondary max-w-2xl">
            Here's an overview of your healthcare activity. Stay on top of your wellness journey.
          </p>
        </div>
        <div className="shrink-0 hidden md:block">
          <Link to="/records">
            <Button variant="primary" iconLeft={Upload}>
              Upload Record
            </Button>
          </Link>
        </div>
      </section>

      {/* Section 2: Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Medical Records</p>
              <h3 className="text-2xl font-bold text-text-primary">12</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Appointments</p>
              <h3 className="text-2xl font-bold text-text-primary">2</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Connected Doctors</p>
              <h3 className="text-2xl font-bold text-text-primary">3</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">AI Insights</p>
              <h3 className="text-2xl font-bold text-text-primary">1</h3>
            </div>
          </CardBody>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 3: Quick Actions */}
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link to="/records" className="block">
                <Card interactive className="h-full hover:border-violet-500/50 group">
                  <CardBody className="p-5 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
                      <Upload className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Upload Medical Record</h4>
                      <p className="text-sm text-text-secondary">Securely store your labs and prescriptions.</p>
                    </div>
                  </CardBody>
                </Card>
              </Link>

              <Link to="/profile" className="block">
                <Card interactive className="h-full hover:border-primary/50 group">
                  <CardBody className="p-5 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">Update Profile</h4>
                      <p className="text-sm text-text-secondary">Keep your emergency contacts and info up to date.</p>
                    </div>
                  </CardBody>
                </Card>
              </Link>

              <Link to="/records" className="block">
                <Card interactive className="h-full hover:border-primary/50 group">
                  <CardBody className="p-5 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">View Medical Records</h4>
                      <p className="text-sm text-text-secondary">Browse your complete health history.</p>
                    </div>
                  </CardBody>
                </Card>
              </Link>

              {/* Disabled / Coming Soon Card */}
              <div className="block cursor-not-allowed">
                <Card className="h-full border-dashed opacity-60">
                  <CardBody className="p-5 flex items-start gap-4 relative">
                    <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center shrink-0 border border-border">
                      <Calendar className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-text-primary">Book Appointment</h4>
                        <Badge variant="secondary" size="sm">Soon</Badge>
                      </div>
                      <p className="text-sm text-text-secondary">Scheduling will be available in a future update.</p>
                    </div>
                  </CardBody>
                </Card>
              </div>

            </div>
          </section>

          {/* Section 4: Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary">Recent Activity</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <Card>
              <div className="divide-y divide-border">
                
                {/* Activity Item 1 */}
                <div className="p-5 flex items-center gap-4 hover:bg-surface-hover transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">Uploaded Blood Report</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> 2 hours ago
                    </p>
                  </div>
                </div>

                {/* Activity Item 2 */}
                <div className="p-5 flex items-center gap-4 hover:bg-surface-hover transition-colors">
                  <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">Updated Emergency Contact</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> Yesterday
                    </p>
                  </div>
                </div>

                {/* Activity Item 3 */}
                <div className="p-5 flex items-center gap-4 hover:bg-surface-hover transition-colors">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">AI Summary Generated</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> 3 days ago
                    </p>
                  </div>
                </div>

              </div>
            </Card>
          </section>
        </div>

        {/* Right Column: Health Tip */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Section 5: Health Tip */}
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
               Daily Health Tip
            </h2>
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardBody className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Droplet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Stay Hydrated</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Drinking enough water supports your overall health, improves brain function, and helps maintain energy levels throughout the day. Aim for at least 8 glasses daily!
                </p>
              </CardBody>
            </Card>
          </section>

        </div>
      </div>
      
    </div>
  );
}
