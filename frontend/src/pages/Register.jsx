import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, reset } from '../features/auth/authSlice';

const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password
    };
    dispatch(registerUser(userData));
  };

  React.useEffect(() => {
    if (isSuccess) {
      navigate('/');
      dispatch(reset());
    }
  }, [isSuccess, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-2xl p-10 border border-[var(--border)] transition-colors duration-300">
        <h2 className="text-4xl font-extrabold text-center text-[var(--text-main)] mb-3">Create Account</h2>
        <p className="text-center text-lg text-[var(--text-muted)] mb-8">Join CodeBuddy to start learning today.</p>
        
        {isError && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 text-center font-medium">{message}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Password</label>
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
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-lg font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-[var(--text-muted)] text-base font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline font-bold">
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
