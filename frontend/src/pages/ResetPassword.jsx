import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const schema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await axios.put(`/api/auth/resetpassword/${resettoken}`, { password: data.password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may be expired or invalid.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-[var(--card)] rounded-2xl shadow-2xl p-6 sm:p-10 border border-[var(--border)]">
        
        {!success ? (
          <>
            <div className="flex items-center justify-center w-16 h-16 bg-[var(--color-primary)]/10 rounded-full mb-6 mx-auto">
              <Lock className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-4xl font-extrabold text-center text-[var(--text-main)] mb-3">Reset Password</h2>
            <p className="text-center text-lg text-[var(--text-muted)] mb-8">
              Enter your new password below.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 text-center font-medium flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">New Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-sm mt-2 font-medium">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 font-medium">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-lg font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6 mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-4">Password Reset Successful!</h2>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-bold text-base transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
