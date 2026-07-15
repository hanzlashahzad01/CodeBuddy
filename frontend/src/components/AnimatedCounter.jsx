import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  // Parse target number (e.g. "50,000+" -> 50000)
  const isPercent = target.includes('%');
  const isPlus = target.includes('+');
  const numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp = null;
          
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentCount = Math.floor(progress * numericTarget);
            setCount(currentCount);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(numericTarget);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [numericTarget, duration]);

  // Format count (e.g. 50000 -> 50,000)
  const formattedCount = count.toLocaleString();

  return (
    <span ref={elementRef}>
      {formattedCount}
      {isPercent ? '%' : ''}
      {isPlus ? '+' : ''}
    </span>
  );
};

export default AnimatedCounter;
