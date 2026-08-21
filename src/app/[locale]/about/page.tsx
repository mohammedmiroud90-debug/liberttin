'use client';

import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Users, 
  Shield, 
  Award,
  Target,
  Eye,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Patient-Centered',
      description: 'We put patients first in everything we do, ensuring their health and well-being is our top priority.',
      color: 'red'
    },
    {
      icon: Users,
      title: 'Human-Powered',
      description: 'Real healthcare professionals, not AI algorithms. Quality care you can trust from licensed medical experts.',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Trust & Privacy',
      description: 'Your health data is secure and protected with industry-leading encryption and privacy standards.',
      color: 'green'
    },
    {
      icon: Award,
      title: 'Quality Care',
      description: 'Verified professionals delivering excellent care with proven track records and continuous training.',
      color: 'purple'
    }
  ];

  const stats = [
    { value: '342+', label: 'Verified Doctors' },
    { value: '12,458', label: 'Patients Served' },
    { value: '45,000+', label: 'Consultations' },
    { value: '4.9/5', label: 'Patient Rating' }
  ];

  return (
    <>
      <SiteHeader />
      
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-[#B8D5D8] via-[#C5DFE0] to-[#A8CDD0] overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
          
          <div className="container px-4 mx-auto max-w-5xl relative z-10 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
              About BILLIANT
            </h1>
            <p className="text-xl text-gray-900 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
              We're on a mission to make quality healthcare accessible, affordable, and available to everyone through verified medical professionals.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-6">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">Our Mission</span>
                </div>
                <h2 className="text-4xl font-bold text-black mb-6" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                  Simplifying Healthcare for Everyone
                </h2>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  To simplify healthcare by building a comprehensive digital platform that connects patients with qualified medical professionals, hospitals, laboratories, pharmacies, and healthcare providers, enabling faster diagnosis, easier access to treatment, and better patient outcomes.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We maintain the highest standards of medical quality, privacy, and trust while leveraging technology to eliminate unnecessary delays and improve healthcare delivery.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <Heart className="h-32 w-32 text-teal-600 opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <Eye className="h-32 w-32 text-purple-600 opacity-30" />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
                  <Eye className="h-5 w-5" />
                  <span className="font-semibold">Our Vision</span>
                </div>
                <h2 className="text-4xl font-bold text-black mb-6" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                  The Future of Healthcare
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become the world's most trusted digital healthcare ecosystem, making quality medical care accessible, affordable, and available to everyone through a network of licensed healthcare professionals and connected medical institutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy */}
        <section className="py-20 bg-black text-white">
          <div className="container px-4 mx-auto max-w-4xl text-center">
            <Lightbulb className="h-16 w-16 text-teal-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
              Core Philosophy
            </h2>
            <p className="text-2xl leading-relaxed mb-4" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
              Technology should connect patients with doctors—not replace doctors.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Every medical decision on BILLIANT is made by qualified healthcare professionals. Technology serves to organize, accelerate, and simplify the healthcare journey, ensuring patients receive timely access to expert care while preserving the essential role of human medical judgment.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-4" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                Our Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do at BILLIANT
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="bg-white border hover:shadow-lg transition-all">
                    <CardContent className="pt-8 pb-8 text-center">
                      <div className={`inline-flex p-4 bg-${value.color}-100 rounded-2xl mb-4`}>
                        <Icon className={`h-8 w-8 text-${value.color}-600`} />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-[#B8D5D8] via-[#C5DFE0] to-[#A8CDD0]">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <TrendingUp className="h-12 w-12 text-black mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-black mb-4" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                Our Impact
              </h2>
              <p className="text-lg text-gray-900">
                Making a difference in healthcare, one patient at a time
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                    <p className="text-4xl font-bold text-black mb-2" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                      {stat.value}
                    </p>
                    <p className="text-gray-700 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-black mb-6" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
              Join Us in Transforming Healthcare
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you're a patient seeking quality care or a healthcare professional looking to make a difference, BILLIANT is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="px-8 py-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors">
                Get Started as Patient
              </a>
              <a href="/doctors/register" className="px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                Join as Healthcare Provider
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
