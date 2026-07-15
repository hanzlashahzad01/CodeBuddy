import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-[var(--card)] rounded-2xl shadow-2xl p-6 sm:p-10 border border-[var(--border)]">
        
        {!submitted ? (
          <>
            <div className="flex items-center justify-center w-16 h-16 bg-[var(--color-primary)]/10 rounded-full mb-6 mx-auto">
              <Mail className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-4xl font-extrabold text-center text-[var(--text-main)] mb-3">Forgot Password?</h2>
            <p className="text-center text-lg text-[var(--text-muted)] mb-8">
              No worries! Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="boss@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-lg font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6 mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-4">Check Your Email!</h2>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              We've sent a password reset link to your email address. Please check your inbox and spam folder.
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

export default ForgotPassword;
