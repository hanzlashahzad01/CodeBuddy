import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Users, BookOpen, Award, PlayCircle, Code2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const features = [
  { icon: <BookOpen className="w-10 h-10" />, title: 'Quality Content', color: 'text-indigo-500', bg: 'bg-indigo-500/10', desc: 'Carefully crafted tutorials and courses covering the latest technologies, from beginner to advanced level.' },
  { icon: <Code2 className="w-10 h-10" />, title: 'Expert Instructors', color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Learn from industry professionals with years of real-world experience building production applications.' },
  { icon: <Users className="w-10 h-10" />, title: 'Strong Community', color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Join 50,000+ students, share knowledge, get help, and grow together in our supportive community.' },
];

const team = [
  { name: 'Muhammad Ali', role: 'Lead Instructor & Founder', initials: 'MA', gradient: 'from-indigo-500 to-purple-600' },
  { name: 'Sara Ahmed', role: 'React & Frontend Expert', initials: 'SA', gradient: 'from-pink-500 to-rose-600' },
  { name: 'Bilal Khan', role: 'Node.js & Backend Expert', initials: 'BK', gradient: 'from-emerald-500 to-teal-600' },
];

const About = () => {
  return (
    <div className="bg-[var(--bg)] transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden py-28 text-center">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
            <motion.span variants={fadeUp} className="inline-block text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-5 py-2 rounded-full mb-8">
              Our Story
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-7xl font-black text-[var(--text-main)] mb-8 leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">CodeBuddy</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-2xl text-[var(--text-muted)] leading-relaxed">
              We started CodeBuddy with a single mission: to make world-class coding education accessible to every student in Pakistan — in their own language, at their own pace.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-base font-bold uppercase tracking-widest text-[var(--color-primary)]">Our Mission</span>
            <h2 className="text-5xl font-black text-[var(--text-main)] mt-3 mb-6">Empowering the Next Generation of Developers</h2>
            <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-6">
              CodeBuddy was founded on the belief that every Pakistani student deserves access to the same quality of tech education available globally — without the language barrier and without breaking the bank.
            </p>
            <p className="text-xl text-[var(--text-muted)] leading-relaxed">
              From free YouTube tutorials to premium project-based courses, we're committed to your growth at every step of your coding journey.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-2 gap-6">
            {[['50K+', 'Students'], ['200+', 'Free Videos'], ['50+', 'Courses'], ['4.9★', 'Rating']].map(([val, label], i) => (
              <div key={i} className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-8 text-center">
                <div className="text-5xl font-black text-[var(--color-primary)] mb-2">{val}</div>
                <div className="text-lg font-bold text-[var(--text-muted)]">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-base font-bold uppercase tracking-widest text-[var(--color-primary)]">Why Choose Us</span>
            <h2 className="text-5xl font-black text-[var(--text-main)] mt-2">What Makes Us Different</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-20 h-20 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-7 ${f.color}`}>{f.icon}</div>
                <h3 className="text-2xl font-bold text-[var(--text-main)] mb-4">{f.title}</h3>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[var(--card)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-base font-bold uppercase tracking-widest text-[var(--color-primary)]">Our Instructors</span>
              <h2 className="text-5xl font-black text-[var(--text-main)] mt-2">Meet the Team</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-10 justify-center">
              {team.map((m, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-[var(--bg)] border border-[var(--border)] rounded-3xl p-10 text-center hover:shadow-2xl transition-all">
                  <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white text-4xl font-black mx-auto mb-6`}>{m.initials}</div>
                  <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">{m.name}</h3>
                  <p className="text-lg text-[var(--text-muted)] font-medium">{m.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-5xl font-black text-[var(--text-main)] mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-[var(--text-muted)] mb-10">Join over 50,000 students already learning with CodeBuddy.</p>
          <div className="flex gap-5 justify-center">
            <Link to="/courses" className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xl font-bold rounded-2xl shadow-xl transition-all hover:scale-105">Browse Courses</Link>
            <Link to="/tutorials" className="px-10 py-5 bg-[var(--card)] border-2 border-[var(--border)] text-[var(--text-main)] text-xl font-bold rounded-2xl hover:border-[var(--color-primary)] transition-all hover:scale-105">Free Tutorials</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
