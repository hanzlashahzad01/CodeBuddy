import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Globe } from 'lucide-react';
import { FaGithub, FaLinkedin, FaYoutube, FaTiktok, FaFacebookF, FaInstagram } from 'react-icons/fa';

// ... socialLinks definition remains same ...
const socialLinks = [
  {
    href   : 'http://www.youtube.com/@CodeBuddy166',
    icon   : <FaYoutube className="w-5 h-5" />,
    label  : 'YouTube',
    hover  : 'hover:text-red-500',
  },
  {
    href   : 'https://www.facebook.com/codebuddy661?mibextid=ZbWKwL',
    icon   : <FaFacebookF className="w-5 h-5" />,
    label  : 'Facebook',
    hover  : 'hover:text-blue-500',
  },
  {
    href   : 'https://www.instagram.com/codebuddy661?igsh=YzljYTk1ODg3Zg==',
    icon   : <FaInstagram className="w-5 h-5" />,
    label  : 'Instagram',
    hover  : 'hover:text-pink-500',
  },
  {
    href   : 'https://www.tiktok.com/@codebuddy05?_t=ZS-8z0TmF4eBPk&_r=1',
    icon   : <FaTiktok className="w-5 h-5" />,
    label  : 'TikTok',
    hover  : 'hover:text-[var(--text-main)]',
  },
  {
    href   : 'https://www.linkedin.com/in/hanzla-shahzad',
    icon   : <FaLinkedin className="w-5 h-5" />,
    label  : 'LinkedIn',
    hover  : 'hover:text-blue-400',
  },
  {
    href   : 'https://github.com/hanzlashahzad01/hanzlashahzad01',
    icon   : <FaGithub className="w-5 h-5" />,
    label  : 'GitHub',
    hover  : 'hover:text-[var(--text-main)]',
  },
  {
    href   : 'https://advance-portfolio-website-aoae.vercel.app/',
    icon   : <Globe className="w-5 h-5" />,
    label  : 'Portfolio',
    hover  : 'hover:text-[var(--color-primary)]',
  },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };
  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <Code2 className="text-[var(--color-primary)] w-9 h-9" />
              <span className="font-bold text-2xl text-[var(--text-main)] tracking-tight">CodeBuddy</span>
            </Link>
            <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">
              Master coding with premium tutorials, courses, and an amazing community. Sikhein, Barhen, Kamayein! 🇵🇰
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3 text-[var(--text-muted)]">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className={`w-9 h-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center transition-all hover:scale-110 hover:border-transparent hover:shadow-lg ${s.hover}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--text-main)] font-bold text-base mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm text-[var(--text-muted)]">
              <li><Link to="/playlists" className="hover:text-[var(--color-primary)] transition-colors">Free Lectures</Link></li>
              <li><Link to="/tutorials" className="hover:text-[var(--color-primary)] transition-colors">All Tutorials</Link></li>
              <li><Link to="/roadmap"   className="hover:text-[var(--color-primary)] transition-colors">Learning Roadmaps</Link></li>
              <li><Link to="/sandbox"   className="hover:text-[var(--color-primary)] transition-colors">Code Playground</Link></li>
              <li><Link to="/courses"   className="hover:text-[var(--color-primary)] transition-colors">Premium Courses</Link></li>
              <li><Link to="/blogs"     className="hover:text-[var(--color-primary)] transition-colors">Tech Blog</Link></li>
              <li><Link to="/notes"     className="hover:text-[var(--color-primary)] transition-colors">Download Notes</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[var(--text-main)] font-bold text-base mb-5">Support</h3>
            <ul className="space-y-3 text-sm text-[var(--text-muted)]">
              <li><Link to="/contact" className="hover:text-[var(--color-primary)] transition-colors">Contact Us</Link></li>
              <li><Link to="/faq"     className="hover:text-[var(--color-primary)] transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms"   className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[var(--text-main)] font-bold text-base mb-5">Subscribe</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">Get the latest courses and tech articles in your inbox.</p>
            {subscribed ? (
              <div className="bg-[var(--bg)] border border-green-500/30 text-green-500 rounded-lg p-3 text-center text-sm font-semibold">
                🎉 Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-2.5 rounded-l-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-sm rounded-r-lg transition-colors cursor-pointer"
                >
                  Go
                </button>
              </form>
            )}

            {/* Portfolio link */}
            <a
              href="https://advance-portfolio-website-aoae.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              <Globe className="w-4 h-4" /> Instructor's Portfolio →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} CodeBuddy. All rights reserved.</p>
          <p>
            Made with ❤️ by{' '}
            <a
              href="https://www.linkedin.com/in/hanzla-shahzad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] font-semibold hover:underline"
            >
              Hanzla Shahzad
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
