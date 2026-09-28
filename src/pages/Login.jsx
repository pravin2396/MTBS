import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';

const Login = () => {
  const { login, rememberedEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  // Where to redirect after login (defaults to dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Pre-fill remembered email
  useEffect(() => {
    if (rememberedEmail) {
      setValue('email', rememberedEmail);
      setValue('rememberMe', true);
    }
  }, [rememberedEmail, setValue]);

  // Quick fill demo credentials
  const fillDemoAccount = () => {
    setValue('email', 'alex@cinema.com');
    setValue('password', 'Password123!');
    toast.info('Demo credentials loaded!', { autoClose: 1500 });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      toast.success(`Welcome back, ${user.name}! 🍿`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to book tickets & snacks"
    >
      {/* Quick Demo Credentials Pill */}
      <div className="mb-6 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-300 text-xs">
          <Sparkles className="h-4 w-4 shrink-0 text-rose-400" />
          <span>Testing? Use pre-configured demo account</span>
        </div>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors cursor-pointer"
        >
          Auto-fill
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-gray-300 uppercase">
            Email Address
          </label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@cinema.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              className={`w-full rounded-xl bg-slate-900/80 px-10 py-3 text-sm text-gray-100 placeholder-gray-500 border transition-all duration-200 outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-white/10 hover:border-white/20 focus:border-rose-500 focus:ring-rose-500/20'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
              <span>•</span> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter your password"
          register={register}
          error={errors.password}
          validationRules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer group select-none">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 rounded border-gray-600 bg-slate-900/80 text-rose-600 focus:ring-rose-500/30 accent-rose-600 transition-colors"
            />
            <span className="text-xs text-gray-300 group-hover:text-gray-200 transition-colors">
              Remember me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99]"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <p className="text-xs text-gray-400">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-4 transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
