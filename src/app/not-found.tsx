import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import './globals.css';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | Billiant</title>
        <meta name="description" content="Page not found. Return to Billiant." />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-black text-white">
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-black to-black" />
          <div className="relative z-10 text-center max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-400 mb-10">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/en"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
              <Link
                href="/en/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-950 border border-gray-700 text-white font-semibold rounded-lg"
              >
                <Search className="h-5 w-5" />
                Search articles
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
