import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Monitor, Server, Layers, HelpCircle, Code, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roadmaps = {
  frontend: {
    title: 'Frontend Developer Roadmap',
    description: 'Learn how to build beautiful, interactive, and responsive user interfaces. Go from absolute beginner to production-ready React developer.',
    icon: <Monitor className="w-6 h-6" />,
    color: 'from-blue-600 to-cyan-500',
    steps: [
      {
        title: 'Step 1: The Basics (HTML & CSS)',
        desc: 'Learn how web pages work. Structure content with HTML5 and style layouts with CSS3, Flexbox, and Grid.',
        topics: ['HTML5 semantic elements', 'CSS Flexbox & CSS Grid', 'Responsive Web Design (Media Queries)'],
        link: '/category/html-css',
        linkLabel: 'Explore HTML & CSS Tutorials',
        status: 'Recommended'
      },
      {
        title: 'Step 2: Programming Fundamentals (JavaScript)',
        desc: 'Add interactivity and logic. Understand ES6 syntax, variables, loops, DOM manipulation, APIs, and asynchronous programming.',
        topics: ['ES6+ features (promises, destructuring)', 'Fetch API & Axios calls', 'DOM Events & LocalStorage'],
        link: '/category/javascript',
        linkLabel: 'Explore JavaScript Tutorials',
        status: 'Crucial'
      },
      {
        title: 'Step 3: Styling Frameworks',
        desc: 'Speed up your styling workflow using modern CSS frameworks like Tailwind CSS or Bootstrap.',
        topics: ['Utility-first CSS with Tailwind', 'Bootstrap Grid system', 'Customizing design systems'],
        link: '/playlists',
        linkLabel: 'Browse Playlists',
        status: 'Optional but Helpful'
      },
      {
        title: 'Step 4: Frontend Framework (React)',
        desc: 'Build component-driven single-page applications. Learn components, props, state, hooks, and routing.',
        topics: ['React Components & JSX', 'useState, useEffect, useContext', 'React Router Dom & State Management'],
        link: '/category/react',
        linkLabel: 'Explore React Tutorials',
        status: 'High Demand'
      },
      {
        title: 'Step 5: Version Control & Deployment',
        desc: 'Learn to track code changes using Git and host your frontend projects on GitHub Pages, Netlify, or Vercel.',
        topics: ['Git clone, add, commit, push', 'Handling merge conflicts', 'Vercel & Netlify hosting'],
        link: '/category/git-github',
        linkLabel: 'Explore Git & GitHub Tutorials',
        status: 'Must Know'
      }
    ]
  },
  backend: {
    title: 'Backend Developer Roadmap',
    description: 'Master server-side logic, routing, REST APIs, and databases. Build robust systems that handle security and heavy data loads.',
    icon: <Server className="w-6 h-6" />,
    color: 'from-green-600 to-emerald-500',
    steps: [
      {
        title: 'Step 1: Version Control & CLI',
        desc: 'Familiarize yourself with terminal commands and Git setup before writing server code.',
        topics: ['Linux/Terminal basic commands', 'Git repositories & branch management'],
        link: '/category/git-github',
        linkLabel: 'Learn Git & GitHub',
        status: 'Crucial'
      },
      {
        title: 'Step 2: Server Runtime (Node.js & Express)',
        desc: 'Use JavaScript on the server. Write HTTP servers, endpoints, handle middle-wares, and cookies.',
        topics: ['Node.js Event loop', 'Express routing & requests', 'Middlewares, CORS, Error Handling'],
        link: '/category/nodejs',
        linkLabel: 'Explore Node.js Tutorials',
        status: 'Recommended'
      },
      {
        title: 'Step 3: Databases (MongoDB or SQL)',
        desc: 'Persist application data. Learn database schema design, queries, relations, and aggregations.',
        topics: ['MongoDB / Mongoose schemas', 'SQL relational design (MySQL / PostgreSQL)', 'CRUD queries & joins'],
        link: '/category/mongodb',
        linkLabel: 'Explore MongoDB Tutorials',
        status: 'Crucial'
      },
      {
        title: 'Step 4: API Design & Security',
        desc: 'Build secure APIs. Implement JSON Web Tokens (JWT) authentication, password hashing, and input validation.',
        topics: ['JWT Authentication & Route Guards', 'Bcrypt password hashing', 'CORS, Helmet, Rate limiting'],
        link: '/tutorials',
        linkLabel: 'Browse Security Tutorials',
        status: 'Highly Critical'
      },
      {
        title: 'Step 5: Alternative Backend (PHP / Laravel)',
        desc: 'Laravel is highly popular for MVC setups. Learn PHP basics and MVC patterns using Laravel.',
        topics: ['PHP variables & loops', 'Laravel Eloquent ORM', 'Blade templating & MVC structures'],
        link: '/category/laravel',
        linkLabel: 'Explore Laravel Tutorials',
        status: 'High Demand'
      }
    ]
  },
  fullstack: {
    title: 'Full Stack Developer Roadmap',
    description: 'The complete journey. Combine frontend UI creation with robust backend endpoints. Become a self-sufficient developer.',
    icon: <Layers className="w-6 h-6" />,
    color: 'from-purple-600 to-pink-500',
    steps: [
      {
        title: 'Step 1: Frontend Basics',
        desc: 'Start with building layout designs using HTML, CSS and simple JavaScript actions.',
        topics: ['Semantic layout tagging', 'Flexbox & CSS variables', 'Vanilla JS events'],
        link: '/category/html-css',
        linkLabel: 'Get Started',
        status: 'Step 1'
      },
      {
        title: 'Step 2: Intermediate Frontend',
        desc: 'Scale up your frontend capabilities by coding interactive components with modern framework states.',
        topics: ['React functional components', 'Managing inputs & hooks', 'SPA clients routing'],
        link: '/category/react',
        linkLabel: 'Learn React',
        status: 'Step 2'
      },
      {
        title: 'Step 3: Backend & Database Connection',
        desc: 'Wire your React app to a live database. Build Express controllers that read/write database documents.',
        topics: ['Connecting backend to database', 'Handling Axios requests', 'State synchronization'],
        link: '/category/nodejs',
        linkLabel: 'Learn Backend Development',
        status: 'Step 3'
      },
      {
        title: 'Step 4: Full Stack Project Builds',
        desc: 'Combine everything by building full-fledged applications from scratch.',
        topics: ['E-commerce stores', 'LMS / Learning portals', 'Blog posting engines'],
        link: '/category/projects',
        linkLabel: 'Explore Real World Projects',
        status: 'High Demand'
      }
    ]
  }
};

const Roadmap = () => {
  const [activeTab, setActiveTab] = useState('frontend');

  const activeRoadmap = roadmaps[activeTab];

  return (
    <div className="bg-[var(--bg)] min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-2 rounded-full mb-4">
            <Compass className="w-4 h-4" /> Career Guidance
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-[var(--color-text-main)] mb-4">
            Learning Roadmaps
          </h1>
          <p className="text-base sm:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Choose your career path, follow the step-by-step timeline, and access curated free tutorials to land your dream job! 🇵🇰
          </p>
        </div>

        {/* Path Selection Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          {Object.entries(roadmaps).map(([key, map]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-base transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-xl shadow-indigo-600/20'
                    : 'bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]'
                }`}
              >
                {map.icon}
                <span>{map.title.split(' ')[0]} Path</span>
              </button>
            );
          })}
        </div>

        {/* Roadmap details container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Overview Card */}
            <div className={`p-8 sm:p-10 rounded-3xl bg-gradient-to-r ${activeRoadmap.color} text-white shadow-2xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-black mb-4">{activeRoadmap.title}</h2>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed">{activeRoadmap.description}</p>
              </div>
            </div>

            {/* Timeline steps */}
            <div className="relative border-l-2 border-[var(--color-border)] ml-4 sm:ml-8 pl-8 sm:pl-12 space-y-12 py-4">
              {activeRoadmap.steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[45px] sm:-left-[61px] top-1 w-8 h-8 rounded-full bg-[var(--color-bg)] border-4 border-[var(--color-primary)] flex items-center justify-center text-white z-10 transition-transform group-hover:scale-115">
                    <span className="text-xs font-black">{idx + 1}</span>
                  </div>

                  {/* Step Card */}
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
                        {step.title}
                      </h3>
                      {step.status && (
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full w-fit">
                          {step.status}
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-6 leading-relaxed">
                      {step.desc}
                    </p>

                    {/* Topics checkmarks */}
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Key skills to learn:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {step.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2 text-sm text-[var(--color-text-main)]">
                            <Code className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tutorial Link button */}
                    <Link
                      to={step.link}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:opacity-85 transition-opacity pt-2 border-t border-[var(--color-border)] w-full"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{step.linkLabel}</span>
                      <ArrowRight className="w-4 h-4 ml-auto sm:ml-0" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Ending Help banner */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[var(--color-text-main)]">Need personal mentorship or guidance?</h4>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">Get custom advice, roadmaps, and profile reviews on our WhatsApp support.</p>
                </div>
              </div>
              <a
                href="https://wa.me/923287299206?text=Mentorship%20Roadmap"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Chat on WhatsApp</span>
                <Star className="w-4 h-4 fill-slate-950" />
              </a>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Roadmap;
