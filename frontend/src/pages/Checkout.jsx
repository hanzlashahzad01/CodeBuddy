import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    alert('Payment successful! Welcome to the course.');
    navigate('/dashboard');
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[var(--color-text-main)] mb-4">Secure Checkout</h1>
          <p className="text-lg text-[var(--color-text-muted)] flex justify-center items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" /> 256-bit SSL encryption
          </p>
        </div>
        
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-10 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-6">Payment Details</h2>
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text-main)] mb-2">Card Information</label>
                <div className="p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-bg)] text-[var(--color-text-muted)]">
                  Stripe Element Placeholder
                </div>
              </div>
              <button type="submit" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg mt-6">
                Pay Now
              </button>
            </form>
          </div>
          
          <div className="p-10 w-full md:w-1/2 bg-[var(--color-bg)]">
            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-[var(--color-text-main)] font-semibold">
                <span>Course Access</span>
                <span>$99.99</span>
              </div>
              <div className="flex justify-between items-center text-[var(--color-text-muted)]">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="border-t border-[var(--color-border)] pt-4 flex justify-between items-center text-2xl font-extrabold text-[var(--color-text-main)]">
              <span>Total</span>
              <span>$99.99</span>
            </div>
            
            <div className="mt-8 space-y-3">
              <p className="flex items-center text-sm font-medium text-[var(--color-text-muted)]">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> 30-Day Money-Back Guarantee
              </p>
              <p className="flex items-center text-sm font-medium text-[var(--color-text-muted)]">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Lifetime Access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
