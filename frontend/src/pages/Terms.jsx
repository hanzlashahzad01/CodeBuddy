import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-[var(--color-text-main)]">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="mb-4 text-[var(--color-text-muted)]">Last Updated: October 2026</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and CodeBuddy ("Company," "we," "us," or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. User Representations</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
