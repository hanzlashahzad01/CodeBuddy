import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Tag, X, Percent, Loader2 } from 'lucide-react';
import axios from 'axios';

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`/api/courses/${courseId}`);
      if (data.success) {
        setCourse(data.data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    setCouponError('');
    
    try {
      const { data } = await axios.post('/api/coupons/validate', {
        code: couponCode,
        orderAmount: course?.price || 0
      }, { withCredentials: true });
      
      if (data.success) {
        setAppliedCoupon(data.data);
        setCouponCode('');
      }
    } catch (error) {
      setCouponError(error.response?.data?.error || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon || !course) return 0;
    
    const coursePrice = course.price;
    if (appliedCoupon.discountType === 'percentage') {
      return (coursePrice * appliedCoupon.discountValue) / 100;
    } else {
      return appliedCoupon.discountValue;
    }
  };

  const calculateTotal = () => {
    if (!course) return 0;
    const discount = calculateDiscount();
    return Math.max(0, course.price - discount);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    try {
      const { data } = await axios.post('/api/orders', {
        courseId,
        paymentMethod: 'card',
        couponApplied: appliedCoupon?.code
      }, { withCredentials: true });
      
      if (data.success) {
        alert('Payment successful! Welcome to the course.');
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg)] min-h-screen py-16 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-[var(--bg)] min-h-screen py-16 px-4 flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Course not found</p>
      </div>
    );
  }

  const discount = calculateDiscount();
  const total = calculateTotal();

  return (
    <div className="bg-[var(--bg)] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[var(--text-main)] mb-4">Secure Checkout</h1>
          <p className="text-lg text-[var(--text-muted)] flex justify-center items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" /> 256-bit SSL encryption
          </p>
        </div>
        
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Payment Form */}
          <div className="p-8 lg:p-10 w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6">Payment Details</h2>
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">Card Information</label>
                <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--text-muted)]">
                  Stripe Element Placeholder
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={processingPayment}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay PKR {total.toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="p-8 lg:p-10 w-full lg:w-1/2 bg-[var(--bg)]">
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">Order Summary</h2>
            
            {/* Course Info */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 mb-6">
              <h3 className="font-bold text-[var(--text-main)] mb-2">{course.title}</h3>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-bold">
                  {course.level}
                </span>
                <span>•</span>
                <span>{course.category}</span>
              </div>
            </div>
            
            {/* Coupon Section */}
            <div className="mb-6">
              {appliedCoupon ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Tag className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-500">{appliedCoupon.code}</p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountValue}% off` 
                            : `PKR ${appliedCoupon.discountValue} off`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-500 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[var(--text-main)]">Have a coupon?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] uppercase"
                    />
                    <button
                      type="button"
                      onClick={validateCoupon}
                      disabled={validatingCoupon}
                      className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {validatingCoupon ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Tag className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm font-semibold">{couponError}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-[var(--text-main)] font-semibold">
                <span>Course Price</span>
                <span>PKR {course.price.toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-4 h-4" />
                    Discount
                  </span>
                  <span>-PKR {discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-[var(--text-muted)]">
                <span>Tax</span>
                <span>PKR 0.00</span>
              </div>
            </div>
            
            <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center text-2xl font-extrabold text-[var(--text-main)]">
              <span>Total</span>
              <span>PKR {total.toLocaleString()}</span>
            </div>
            
            <div className="mt-8 space-y-3">
              <p className="flex items-center text-sm font-medium text-[var(--text-muted)]">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> 30-Day Money-Back Guarantee
              </p>
              <p className="flex items-center text-sm font-medium text-[var(--text-muted)]">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Lifetime Access
              </p>
              <p className="flex items-center text-sm font-medium text-[var(--text-muted)]">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Certificate of Completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
