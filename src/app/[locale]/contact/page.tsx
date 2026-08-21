'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('ContactPage');

  return (
    <>
      <SiteHeader />
      
      <main className="bg-[#FBF7F4] min-h-screen">
        {/* Hero Section - Clean & Minimalist */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Contact Us
            </h1>
            <div className="space-y-4 text-black leading-relaxed">
              <p className="text-lg">
                About <span className="text-teal-600 font-semibold">BILLIANT</span>
              </p>
              
              <p>
                Our goal is to deliver the highest caliber content that provides a sense of clarity and inspires healthy actions for our readers along their health and well-being journeys. When a reader alerts us to a potential issue with our content, such as incomplete, inaccurate, outdated, unclear, or contradictory information, our editorial and medical teams research the feedback, determine the opportunities for improvement, and republish our content with necessary revisions.
              </p>
              
              <p>
                For sponsorship and advertising opportunities with BILLIANT, please see our{' '}
                <a href="/advertising" className="text-teal-600 hover:underline font-semibold">
                  BILLIANT Media Advertising page
                </a>.
              </p>
              
              <p>
                BILLIANT is a digital publisher and does not offer personal health or medical advice. If you're facing a medical emergency, call your local emergency services immediately, or visit the nearest emergency room or urgent care center. You should consult your healthcare provider before starting any nutrition, diet, exercise, fitness, medical, or wellness program.
              </p>
            </div>
          </div>
        </section>

        {/* Social Media Links */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-bold text-black">billiant</h2>
              <div className="flex items-center gap-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-[#FBF7F4] rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Get our wellness newsletter
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Filter out the noise and nurture your inbox with health and wellness advice that's inclusive and rooted in medical expertise.
              </p>
              <form className="flex gap-3 max-w-xl">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors"
                >
                  SIGN UP
                </button>
              </form>
              <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                Your privacy is important to us. Any information you provide to us via this website may be placed by us on servers located in countries outside of the EU. If you do not agree to such placement, do not provide the information.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Links Grid */}
        <section className="bg-white py-12 border-t border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* About Us */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">About Us</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/about" className="text-gray-600 hover:text-teal-600">About Us</a></li>
                  <li><a href="/contact" className="text-gray-600 hover:text-teal-600">Contact Us</a></li>
                  <li><a href="/privacy" className="text-gray-600 hover:text-teal-600">Privacy Notice</a></li>
                  <li><a href="/privacy-settings" className="text-gray-600 hover:text-teal-600">Privacy Settings</a></li>
                  <li><a href="/sitemap" className="text-gray-600 hover:text-teal-600">Sitemap</a></li>
                </ul>
              </div>

              {/* Medical Affairs */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Medical Affairs</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/medical-affairs" className="text-gray-600 hover:text-teal-600">Medical Affairs</a></li>
                  <li><a href="/content-integrity" className="text-gray-600 hover:text-teal-600">Content Integrity</a></li>
                  <li><a href="/newsletters" className="text-gray-600 hover:text-teal-600">Newsletters</a></li>
                  <li><a href="/advertising" className="text-gray-600 hover:text-teal-600">Advertising Policy</a></li>
                </ul>
              </div>

              {/* Health Topics */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Health Topics</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/conditions" className="text-gray-600 hover:text-teal-600">Health Conditions</a></li>
                  <li><a href="/wellness" className="text-gray-600 hover:text-teal-600">Wellness</a></li>
                  <li><a href="/doctors" className="text-gray-600 hover:text-teal-600">Find a Doctor</a></li>
                  <li><a href="/tools" className="text-gray-600 hover:text-teal-600">Health Tools</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/terms" className="text-gray-600 hover:text-teal-600">Terms of Use</a></li>
                  <li><a href="/privacy" className="text-gray-600 hover:text-teal-600">Privacy Policy</a></li>
                  <li><a href="/accessibility" className="text-gray-600 hover:text-teal-600">Accessibility</a></li>
                  <li><a href="/hipaa" className="text-gray-600 hover:text-teal-600">HIPAA Compliance</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed">
                © 2026 BILLIANT Media LLC. All rights reserved. BILLIANT Media is an RVO Health Company. Our content and products are for informational purposes only. BILLIANT Media does not provide medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
