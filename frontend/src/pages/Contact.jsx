import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { FaWhatsapp, FaYoutube, FaGithub } from 'react-icons/fa';
import api from '../utils/axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.post('/messages', data);
      setSubmitted(true);
      reset();
    } catch (err) {
      // Still show success for demo; in production handle error
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-[var(--bg)] transition-colors duration-300">
      {/* Hero */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.span initial="hidden" animate="visible" variants={fadeUp} className="inline-block text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-5 py-2 rounded-full mb-8">Get in Touch</motion.span>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-7xl font-black text-[var(--text-main)] mb-6">Contact Us</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-xl text-[var(--text-muted)]">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-[var(--text-main)] mb-6">Let's Connect</h2>
              <p className="text-lg text-[var(--text-muted)] leading-relaxed">We're here to help! Reach out to us through any of these channels and we'll get back to you within 24 hours.</p>
            </div>
            {[
              { icon: <Mail className="w-6 h-6" />, label: 'Email', value: 'codebuddy166@gmail.com', href: 'mailto:codebuddy166@gmail.com', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { icon: <FaWhatsapp className="w-6 h-6" />, label: 'WhatsApp', value: '03287299206', href: 'https://wa.me/923287299206?text=Assist%20me', color: 'text-green-500', bg: 'bg-green-500/10' },
              { icon: <MapPin className="w-6 h-6" />, label: 'Location', value: 'Lahore, Pakistan 🇵🇰', href: null, color: 'text-red-500', bg: 'bg-red-500/10' },
            ].map((item, i) => {
              const content = (
                <>
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>{item.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide">{item.label}</p>
                    <p className="text-lg font-bold text-[var(--text-main)] mt-1">{item.value}</p>
                  </div>
                </>
              );
              return item.href ? (
                <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-center gap-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-300">
                  {content}
                </a>
              ) : (
                <div key={i} className="flex items-center gap-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                  {content}
                </div>
              );
            })}

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
              <p className="text-base font-bold text-[var(--text-muted)] uppercase tracking-wide">Follow Us</p>
              <div className="flex flex-col gap-4">
                <a href="http://www.youtube.com/@CodeBuddy166" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[var(--text-main)] hover:text-red-500 font-bold transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-105 transition-transform"><FaYoutube className="w-5 h-5" /></div>
                  <span>Visit YouTube Channel</span>
                </a>
                <a href="https://github.com/hanzlashahzad01/hanzlashahzad01" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[var(--text-main)] hover:text-[var(--color-primary)] font-bold transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-slate-500/10 text-[var(--text-main)] flex items-center justify-center group-hover:scale-105 transition-transform"><FaGithub className="w-5 h-5" /></div>
                  <span>Visit GitHub Profile</span>
                </a>
                <a href="https://wa.me/923287299206?text=Assist%20me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[var(--text-main)] hover:text-green-500 font-bold transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-105 transition-transform"><FaWhatsapp className="w-5 h-5" /></div>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="md:col-span-3">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 shadow-xl">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-[var(--text-main)] mb-3">Message Sent!</h3>
                    <p className="text-lg text-[var(--text-muted)] mb-8">We'll get back to you within 24 hours. Shukria! 🙏</p>
                    <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors">Send Another Message</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-3xl font-black text-[var(--text-main)] mb-2">Send a Message</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Full Name</label>
                        <input {...register('name')} className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] transition-all" placeholder="John Doe" />
                        {errors.name && <p className="text-red-500 text-sm mt-1 font-medium">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Email Address</label>
                        <input {...register('email')} type="email" className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] transition-all" placeholder="john@example.com" />
                        {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Subject</label>
                      <input {...register('subject')} className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] transition-all" placeholder="How can we help?" />
                      {errors.subject && <p className="text-red-500 text-sm mt-1 font-medium">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-[var(--text-muted)] mb-2">Message</label>
                      <textarea {...register('message')} rows={6} className="w-full px-5 py-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-lg focus:outline-none focus:border-[var(--color-primary)] transition-all resize-none" placeholder="Write your message here..." />
                      {errors.message && <p className="text-red-500 text-sm mt-1 font-medium">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                      <Send className="w-5 h-5" /> {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
