import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/faqs');
        setFaqs(data.data);
      } catch (error) {
        console.error('Error fetching FAQs', error);
      }
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (id) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-[var(--color-text-main)] mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-[var(--color-text-muted)]">Find answers to the most common questions about our platform.</p>
      </div>

      {loading ? (
        <p className="text-center text-xl text-[var(--color-text-muted)]">Loading FAQs...</p>
      ) : (
        <div className="space-y-4">
          {faqs.map(faq => (
            <div key={faq._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => toggleFaq(faq._id)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-[var(--color-text-main)]">{faq.question}</span>
                {openId === faq._id ? (
                  <ChevronUp className="w-6 h-6 text-[var(--color-primary)] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-[var(--color-text-muted)] flex-shrink-0" />
                )}
              </button>
              
              {openId === faq._id && (
                <div className="px-6 pb-5">
                  <p className="text-[var(--color-text-muted)] leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

          {faqs.length === 0 && (
            <p className="text-center text-lg text-[var(--color-text-muted)]">No FAQs available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQ;
