import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, CardBody, Select } from '../components/ui';
import { Activity, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Form Validation
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Split full name into first and last name for the backend payload
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        role: 'PATIENT' // Defaulting to patient for this flow
      };

      const response = await register(payload);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.error?.message || 'Registration failed. Please check your inputs.');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column: Branding Area (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-r border-border p-12 flex-col justify-between relative overflow-hidden fixed h-screen top-0 left-0">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Activity className="text-primary-foreground h-7 w-7" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-text-primary">
              Health OS
            </span>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold text-text-primary leading-tight mb-6 tracking-tight">
              Your health, securely managed in one place.
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-12">
              Join Health OS today to access your medical records, connect with doctors, and manage appointments effortlessly.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">Bank-grade Security</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Your personal data and medical history are encrypted and completely private.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-surface border border-border flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">Easy Onboarding</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Set up your profile in minutes and start managing your health journey instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm font-medium text-text-muted">
          &copy; {new Date().getFullYear()} Health OS. All rights reserved.
        </div>
      </div>

      {/* Right Column: Registration Card */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] flex flex-col items-center justify-center p-6 sm:p-12 relative bg-surface/30 min-h-screen py-12">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center gap-3 mb-8 w-full">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Activity className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-text-primary">Health OS</span>
        </div>

        <div className="w-full max-w-xl lg:mt-0">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">Create Your Account</h2>
            <p className="text-lg text-text-secondary mt-2">Join Health OS to securely manage your medical records.</p>
          </div>

          <Card className="shadow-2xl shadow-primary/5 border-border/50">
            <CardBody className="p-6 sm:p-8">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium flex items-start animate-fade-in">
                  <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input 
                    label="Full Name *"
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Email Address *"
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                    <Input 
                      label="Phone Number"
                      type="tel" 
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Date of Birth"
                      type="date" 
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                    <div className="flex flex-col space-y-2">
                      <label className="block text-sm font-medium text-text-secondary ml-1">Gender</label>
                      <Select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Password *"
                      type="password" 
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                    />
                    <Input 
                      label="Confirm Password *"
                      type="password" 
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <div className="w-5 h-5 border-2 border-border rounded bg-background transition-colors peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 group-hover:border-primary/50 shrink-0"></div>
                      <svg className="absolute w-3.5 h-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                      I agree to the <a href="#" className="font-semibold text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-primary hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  isLoading={isSubmitting}
                  fullWidth={true}
                  size="lg"
                  iconRight={ChevronRight}
                  className="mt-6"
                >
                  Create Account
                </Button>
              </form>
            </CardBody>
          </Card>

          <p className="mt-8 text-center text-sm font-medium text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors focus:outline-none focus:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
