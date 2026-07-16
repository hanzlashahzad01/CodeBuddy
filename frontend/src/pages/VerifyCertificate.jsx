import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Award, Calendar, User, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`/api/certificates/verify/${certificateId.trim()}`);
      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Certificate verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] mb-4">
            Certificate Verification
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Verify the authenticity of CodeBuddy certificates by entering the certificate ID
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp}
          className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 md:p-8 shadow-xl mb-8"
        >
          <form onSubmit={handleVerify} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter Certificate ID (e.g., CB-ABC123-XYZ789-1234567890)"
                className="w-full px-6 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Verify</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-500 mb-2">Verification Failed</h3>
                <p className="text-[var(--text-muted)]">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Result */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8 shadow-xl"
          >
            <div className="flex items-start gap-6 mb-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-emerald-500 mb-2">Certificate Verified!</h3>
                <p className="text-[var(--text-muted)]">This certificate is authentic and valid.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Info */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Student Name</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-main)]">{result.studentName}</p>
              </div>

              {/* Course Info */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Course</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-main)]">{result.courseName}</p>
              </div>

              {/* Issue Date */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Issue Date</span>
                </div>
                <p className="text-xl font-bold text-[var(--text-main)]">
                  {new Date(result.issueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Certificate ID */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Certificate ID</span>
                </div>
                <p className="text-lg font-bold text-[var(--text-main)] font-mono break-all">{result.certificateId}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-500/20">
              <p className="text-sm text-[var(--text-muted)] text-center">
                Verified on {new Date(result.verificationDate).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp}
          className="mt-12 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">How to find Certificate ID?</h3>
          <ul className="space-y-3 text-[var(--text-muted)]">
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-primary)] mt-1">•</span>
              <span>Login to your CodeBuddy account</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-primary)] mt-1">•</span>
              <span>Go to Dashboard → Certificates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-primary)] mt-1">•</span>
              <span>Click on "Download Certificate" to see your Certificate ID</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
