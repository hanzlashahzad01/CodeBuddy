import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message, user } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  React.useEffect(() => {
    if (isSuccess && user) {
      dispatch(reset());
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isSuccess, user, navigate, dispatch]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4 transition-colors duration-300">
      <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-2xl p-10 border border-[var(--border)] transition-colors duration-300">
        <h2 className="text-4xl font-extrabold text-center text-[var(--text-main)] mb-3">Welcome Back</h2>
        <p className="text-center text-lg text-[var(--text-muted)] mb-8">Sign in to continue your learning journey.</p>
        
        {isError && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 text-center font-medium">{message}</div>}

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

          <div className="flex items-center justify-between text-base">
            <label className="flex items-center text-[var(--text-muted)] font-medium cursor-pointer">
              <input type="checkbox" className="mr-3 w-5 h-5 rounded border-[var(--border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-bold transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-lg font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-[var(--text-muted)] text-base font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary)] hover:underline font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
