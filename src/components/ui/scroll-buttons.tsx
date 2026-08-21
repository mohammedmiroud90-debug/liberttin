'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function ScrollButtons() {
  const [showButtons, setShowButtons] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Show buttons after scrolling 300px
      setShowButtons(scrollTop > 300);
      
      // Check if near bottom (within 100px)
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  if (!showButtons) return null;

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="group bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Scroll to Bottom Button - Only show if not at bottom */}
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="group bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
