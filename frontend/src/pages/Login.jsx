import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, CardBody } from '../components/ui';
import { Activity, ShieldCheck, HeartPulse, ChevronRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await login(email, password);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.error?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An unexpected error occurred while logging in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column: Branding Area (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-r border-border p-12 flex-col justify-between relative overflow-hidden">
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
              Access your medical records, connect with doctors, and manage appointments effortlessly through our modern patient portal.
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
                  <HeartPulse className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">Comprehensive Care</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">Everything you need for your healthcare journey, organized beautifully.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm font-medium text-text-muted">
          &copy; {new Date().getFullYear()} Health OS. All rights reserved.
        </div>
      </div>

      {/* Right Column: Login Card */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-surface/30 min-h-screen">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden flex items-center justify-center gap-3 mb-8 w-full">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Activity className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-text-primary">Health OS</span>
        </div>

        <div className="w-full max-w-md lg:mt-0">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-4xl font-extrabold text-text-primary tracking-tight">Welcome Back</h2>
            <p className="text-lg text-text-secondary mt-2">Sign in to continue to your account.</p>
          </div>

          <Card className="shadow-2xl shadow-primary/5 border-border/50">
            <CardBody className="p-8">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium flex items-start animate-fade-in">
                  <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                  label="Email Address"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                />

                <div className="space-y-2">
                  <Input 
                    label="Password"
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <div className="w-5 h-5 border-2 border-border rounded bg-background transition-colors peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 group-hover:border-primary/50"></div>
                      <svg className="absolute w-3.5 h-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-text-secondary select-none group-hover:text-text-primary transition-colors">Remember me</span>
                  </label>

                  <a href="#" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors focus:outline-none focus:underline">
                    Forgot Password?
                  </a>
                </div>

                <Button 
                  type="submit" 
                  isLoading={isSubmitting}
                  fullWidth={true}
                  size="lg"
                  iconRight={ChevronRight}
                  className="mt-4"
                >
                  Login to Health OS
                </Button>
              </form>
            </CardBody>
          </Card>

          <p className="mt-8 text-center text-sm font-medium text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-colors focus:outline-none focus:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
