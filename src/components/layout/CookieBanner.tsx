'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    setShowBanner(false);
  };

  const customize = () => {
    // TODO: Open cookie preferences modal
    alert('Cookie preferences customization coming soon');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1e3a8a] text-white shadow-2xl border-t-4 border-teal-500">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Cookie Notice</h3>
            <p className="text-sm leading-relaxed text-blue-100">
              We use cookies to enable certain functions and tools on this website, track resources and data used on this website, and promote our products and services. We also share information about your use of our website with our analytics partners. If you select "Reject Cookies," essential cookies will remain active. For more information on our use of cookies, please see our{' '}
              <a href="/privacy" className="underline hover:text-teal-300 font-semibold">
                Website Privacy Policy
              </a>
              . By accessing or using the Labcorp website or other Labcorp online applications, you acknowledge that you understand and agree to be bound by Labcorp's Online Services User Agreement.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              onClick={customize}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#1e3a8a] transition-colors whitespace-nowrap"
            >
              Customize My Experience
            </Button>
            <Button
              onClick={acceptEssential}
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#1e3a8a] transition-colors whitespace-nowrap"
            >
              Reject All Non-Essential Cookies
            </Button>
            <Button
              onClick={acceptAll}
              className="bg-white text-[#1e3a8a] hover:bg-gray-100 font-semibold whitespace-nowrap"
            >
              Accept All Cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
