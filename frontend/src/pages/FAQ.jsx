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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      <div className="text-center mb-10 sm:mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-3 sm:mb-4">Frequently Asked Questions</h1>
        <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-muted)]">Find answers to the most common questions about our platform.</p>
      </div>

      {loading ? (
        <p className="text-center text-base sm:text-lg md:text-xl text-[var(--color-text-muted)]">Loading FAQs...</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {faqs.map(faq => (
            <div key={faq._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => toggleFaq(faq._id)}
                className="w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex justify-between items-center text-left focus:outline-none gap-3"
              >
                <span className="text-base sm:text-lg font-bold text-[var(--color-text-main)] flex-1">{faq.question}</span>
                {openId === faq._id ? (
                  <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-text-muted)] flex-shrink-0" />
                )}
              </button>
              
              {openId === faq._id && (
                <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5">
                  <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}

          {faqs.length === 0 && (
            <p className="text-center text-base sm:text-lg text-[var(--color-text-muted)]">No FAQs available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQ;
