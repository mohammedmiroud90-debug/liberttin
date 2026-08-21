'use client';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CoverageCtaSection() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute -top-10 left-0 w-[120%] h-[70%] opacity-25" viewBox="0 0 1440 600" preserveAspectRatio="none">
          <path
            fill="#99f6e4"
            d="M0,320 C240,180 480,420 720,300 C960,180 1200,380 1440,260 L1440,0 L0,0 Z"
          />
        </svg>
      </div>

      <div className="container relative z-10 px-4 text-center mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
          Keep reading
        </h2>
        <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto px-4">
          Explore the latest articles from the Billiant editorial team.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
          <Link href="/">
            <Button size="lg" variant="secondary">
              Browse articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/search">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-teal-800"
            >
              Search
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
