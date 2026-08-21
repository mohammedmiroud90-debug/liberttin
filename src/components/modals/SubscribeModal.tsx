'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/subscribe', {
      //   method: 'POST',
      //   body: JSON.stringify({ email }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Illustration */}
          <div className="bg-gradient-to-br from-teal-400 to-teal-600 p-8 flex items-center justify-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10 text-center">
              <svg 
                className="w-64 h-64 mx-auto mb-6" 
                viewBox="0 0 200 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simple illustration of person with heart */}
                <circle cx="100" cy="60" r="30" fill="#fff" opacity="0.9"/>
                <path d="M70 90 Q70 80 80 80 Q85 80 90 85 Q95 80 100 80 Q110 80 110 90 Q110 100 90 120 Q70 100 70 90Z" fill="#fff" opacity="0.9"/>
                <rect x="75" y="120" width="50" height="60" rx="25" fill="#fff" opacity="0.9"/>
                <rect x="60" y="130" width="20" height="50" rx="10" fill="#fff" opacity="0.9"/>
                <rect x="120" y="130" width="20" height="50" rx="10" fill="#fff" opacity="0.9"/>
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                You've got a friend in this battle.
              </h3>
              <p className="text-white/90 text-sm">
                Join our healthcare community
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mt-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                Stay Connected
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get the latest healthcare news, treatment options, advice for doctor visits, plus inspirational stories.
              </p>

              {isSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-green-600 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-800 font-semibold">Successfully subscribed!</p>
                  <p className="text-green-600 text-sm mt-1">Welcome to BILLIANT</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 text-lg border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg font-bold rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                  </Button>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Your <a href="/privacy" className="text-teal-600 underline hover:text-teal-700">privacy</a> is important to us. Any information you provide to us via this website may be placed by us on servers located in countries outside of the EU. If you do not agree to such placement, do not provide the information.
                  </p>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <a href="/privacy" className="hover:text-teal-600">Privacy Settings</a>
                  <a href="/newsletters" className="hover:text-teal-600">Newsletters</a>
                  <a href="/topics" className="hover:text-teal-600">Health Topics</a>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  © 2026 BILLIANT Health LLC. All rights reserved. BILLIANT Health is an IRS 501(c)(3) nonprofit. Our website services, content, and products are for informational purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
