import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { useAuth } from '../context/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1 = account info, 2 = address
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '+91', password: '', confirmPassword: '', acceptTerms: false,
    address_line1: '', address_landmark: '', address_city: '', address_state: '', address_pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep1 = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    if (!formData.phone || formData.phone === '+91') e.phone = 'Phone number is required';
    if (!formData.password) e.password = 'Password is required';
    if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) e.acceptTerms = 'Please accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          phone: formData.phone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/', { state: { message: 'Account created successfully! Welcome to the studio.' } });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-100 rounded-2xl p-4 pl-12 font-body text-sm text-gray-700 focus:ring-4 focus:ring-purple-100 focus:border-[var(--color-primary)] transition-all outline-none";
  const inputClassNoIcon = "w-full bg-white border border-gray-100 rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-4 focus:ring-purple-100 focus:border-[var(--color-primary)] transition-all outline-none";
  const labelClass = "text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-1";
  const errorClass = "text-xs text-red-500 ml-1 mt-1";

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gray-900 overflow-hidden">
        <img
          src="/signup_bg.png"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Studio Equipment"
        />
        <div className="relative z-10 p-20 flex flex-col justify-between w-full">

          <div className="flex items-center gap-4 text-white/50 text-[10px] font-body font-bold uppercase tracking-widest">
            <span>© SL SHOPEE</span><div className="w-1 h-1 bg-white/20 rounded-full" /><span>Join The Community</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-gray-50/50 overflow-y-auto">
        <div className="w-full max-w-md space-y-10 py-4">
          <div>
            <Link to="/"><img src="/logo.png" className="h-16 w-auto mb-8" alt="SL SHOPEE" /></Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-400 font-body text-sm">Join our curated community of sentimental curators.</p>
          </div>

          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-body border border-red-100 mb-4">{errors.submit}</div>
          )}
          {/* ── STEP 1: Account Info ── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className={labelClass}>Full Name *</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className={inputClass} placeholder="Enter your name" />
              </div>
              {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Email Address (Optional)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="your@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Phone Number *</label>
              <PhoneInput
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="98765 43210"
              />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Password *</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className={`${inputClass} pr-12`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className={errorClass}>{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Confirm *</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange} className={`${inputClass} pr-12`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3 px-1">
              <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
              <span className="text-xs font-body text-gray-400 leading-relaxed">
                I agree to the <Link to="/terms" className="text-gray-900 font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-gray-900 font-bold hover:underline">Privacy Policy</Link>.
              </span>
            </div>
            {errors.acceptTerms && <p className={errorClass}>{errors.acceptTerms}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-body font-bold text-sm uppercase tracking-widest hover:bg-[var(--color-primary)] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group">
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-center font-body text-sm text-gray-400">
              Already a member?{' '}
              <Link to="/login" className="text-gray-900 font-bold hover:text-[var(--color-primary)] transition-colors">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
