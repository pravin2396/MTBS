import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import PasswordInput from '../components/PasswordInput';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enter email, 2: Reset password, 3: Completed
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form for Step 1: Email check
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    defaultValues: { email: '' },
  });

  // Form for Step 2: New Password
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    watch: watchReset,
    formState: { errors: resetErrors },
  } = useForm({
    defaultValues: { newPassword: '', confirmNewPassword: '' },
  });

  const newPasswordValue = watchReset('newPassword');

  // Submit Step 1: Verify email exists
  const onEmailSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Simulate sending OTP / link
      await new Promise((res) => setTimeout(res, 500));
      setVerifiedEmail(data.email.toLowerCase().trim());
      setStep(2);
      toast.success('Account found! Please create your new password.');
    } catch (error) {
      toast.error(error.message || 'Failed to locate account.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Step 2: Update password in storage
  const onResetSubmit = async (data) => {
    setSubmitting(true);
    try {
      await resetPassword({
        email: verifiedEmail,
        newPassword: data.newPassword,
      });

      setStep(3);
      toast.success('Password updated successfully! 🎬');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={step === 3 ? 'Password Reset!' : 'Reset Password'}
      subtitle={
        step === 1
          ? 'Enter your registered email to reset your access'
          : step === 2
          ? `Create a new password for ${verifiedEmail}`
          : 'Your account security has been updated'
      }
    >
      {/* STEP 1: Email Input */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-gray-300 uppercase">
              Registered Email
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
                {...registerEmail('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={`w-full rounded-xl bg-slate-900/80 px-10 py-3 text-sm text-gray-100 placeholder-gray-500 border transition-all duration-200 outline-none focus:ring-2 ${
                  emailErrors.email
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-white/10 hover:border-white/20 focus:border-rose-500 focus:ring-rose-500/20'
                }`}
              />
            </div>
            {emailErrors.email && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                <span>•</span> {emailErrors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>Continue to Reset</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: New Password Form */}
      {step === 2 && (
        <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4 text-left">
          <PasswordInput
            id="newPassword"
            label="New Password"
            placeholder="Enter new password (min 6 chars)"
            register={registerReset}
            error={resetErrors.newPassword}
            autoComplete="new-password"
            validationRules={{
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
          />

          <PasswordInput
            id="confirmNewPassword"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            register={registerReset}
            error={resetErrors.confirmNewPassword}
            autoComplete="new-password"
            validationRules={{
              required: 'Please confirm your new password',
              validate: (val) =>
                val === newPasswordValue || 'Passwords do not match',
            }}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving New Password...</span>
              </>
            ) : (
              <>
                <span>Save New Password</span>
                <KeyRound className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 3: Success Confirmation */}
      {step === 3 && (
        <div className="py-4 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-sm text-gray-300">
            Your password has been securely reset. You can now log into your CINETICK account.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-600/30 transition-all"
          >
            Go to Login
          </button>
        </div>
      )}

      {/* Return to Login */}
      {step !== 3 && (
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
