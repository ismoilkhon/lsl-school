'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import AboutSection from "@/components/publicComponents/AboutSection";
import ContactSection from "@/components/publicComponents/ContactSection";
import EventsSection from "@/components/publicComponents/EventsSection";
import Footer from "@/components/publicComponents/Footer";
import HeroSection from "@/components/publicComponents/HeroSection";
import NavigationBar from "@/components/publicComponents/Navbar";
import ProgramsSection from "@/components/publicComponents/ProgramsSection";
import SmoothScrolling from "@/components/publicComponents/SmoothScrolling";
import TestimonialsCarousel from "@/components/publicComponents/TestimonialsCarousel";

export default function HomePage() {
  const { user, loading, getUserRole } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('HomePage: useEffect triggered', { user, loading, isAuthenticated: !!user });
    
    if (!loading && user) {
      // User is authenticated, redirect to appropriate dashboard
      const role = getUserRole();
      console.log('HomePage: User authenticated, redirecting to role:', role);
      router.push(`/${role}`);
    }
  }, [user, loading, router, getUserRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the welcome screen as home page
  if (!user) {
    console.log('HomePage: Rendering welcome screen for unauthenticated user');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <SmoothScrolling />
        <NavigationBar />
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <EventsSection />
        <TestimonialsCarousel />
        <ContactSection />
        <Footer />
      </div>
    );
  }

  // This should not be reached, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
