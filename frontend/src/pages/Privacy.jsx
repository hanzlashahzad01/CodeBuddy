import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-[var(--color-text-main)]">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="mb-4 text-[var(--color-text-muted)]">Effective Date: October 2026</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
