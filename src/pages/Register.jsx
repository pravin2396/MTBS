import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';

const Register = () => {
  const { register: registerNewUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const newUser = await registerNewUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success(`Account created! Welcome, ${newUser.name}! 🎉`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join CINETICK for seamless movie bookings and VIP perks"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-semibold tracking-wide text-gray-300 uppercase">
            Full Name
          </label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Sarah Connor"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              className={`w-full rounded-xl bg-slate-900/80 px-10 py-3 text-sm text-gray-100 placeholder-gray-500 border transition-all duration-200 outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-white/10 hover:border-white/20 focus:border-rose-500 focus:ring-rose-500/20'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
              <span>•</span> {errors.name.message}
            </p>
          )}
        </div>

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

        {/* Password Field */}
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Create a strong password (min 6 chars)"
          register={register}
          error={errors.password}
          autoComplete="new-password"
          validationRules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
        />

        {/* Confirm Password Field */}
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          register={register}
          error={errors.confirmPassword}
          autoComplete="new-password"
          validationRules={{
            required: 'Please confirm your password',
            validate: (value) =>
              value === passwordValue || 'Passwords do not match',
          }}
        />

        {/* Terms & Conditions Checkbox */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer group select-none">
            <input
              type="checkbox"
              {...register('terms', {
                required: 'You must agree to the Terms of Service',
              })}
              className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-slate-900/80 text-rose-600 focus:ring-rose-500/30 accent-rose-600"
            />
            <span className="text-xs text-gray-300 leading-tight group-hover:text-gray-200 transition-colors">
              I agree to the{' '}
              <span className="text-rose-400 underline underline-offset-2">Terms of Service</span> and{' '}
              <span className="text-rose-400 underline underline-offset-2">Privacy Policy</span>
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-rose-400 flex items-center gap-1 font-medium">
              <span>•</span> {errors.terms.message}
            </p>
          )}
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <p className="text-xs text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-4 transition-colors"
          >
            Sign In here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
