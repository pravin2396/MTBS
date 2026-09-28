import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = ({
  id,
  label,
  placeholder = '••••••••',
  register,
  error,
  validationRules,
  autoComplete = 'current-password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold tracking-wide text-gray-300 uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
          <Lock className="h-4 w-4" />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...register(id, validationRules)}
          className={`w-full rounded-xl bg-slate-900/80 px-10 py-3 text-sm text-gray-100 placeholder-gray-500 border transition-all duration-200 outline-none focus:ring-2 ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-white/10 hover:border-white/20 focus:border-rose-500 focus:ring-rose-500/20'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-rose-400 transition-colors focus:outline-none"
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium animate-fadeIn">
          <span>•</span> {error.message}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
