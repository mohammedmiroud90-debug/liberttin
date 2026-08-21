'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

export function PrivacyModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already accepted privacy policy
    const hasAccepted = localStorage.getItem('privacy-accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = (type: 'essential' | 'all') => {
    localStorage.setItem('privacy-accepted', type);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4">
        <Card>
          <CardHeader className="relative">
            <CardTitle className="text-2xl">We Care About Your Privacy</CardTitle>
            <CardDescription className="text-base mt-4">
              We and our 59 partner(s) store and access personal data, like browsing data or unique identifiers, on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">We and our partners process data to provide:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Store and/or access information on a device</li>
                <li>• Understand audiences through statistics or combinations of data</li>
                <li>• Develop and improve services</li>
                <li>• Create profiles for personalized content</li>
                <li>• Measure advertising performance</li>
              </ul>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Selecting "Reject Non-essential" or withdrawing your consent will disable them. If you accept, 
                cookies will be set and data processed to deliver personalized ads. You can resurface this menu 
                to change your choices or withdraw consent at any time by clicking the "Purpose of Processing" 
                link on the bottom of the webpage.
              </p>
              <button className="text-primary hover:underline mt-2">
                List of Partners (vendors)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleAccept('essential')}
              >
                Reject Non-essential
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleAccept('all')}
              >
                Accept Non-essential
              </Button>
            </div>

            <div className="text-center">
              <button className="text-sm text-muted-foreground hover:text-primary">
                Purpose of Processing
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
