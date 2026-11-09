import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Publication, Meeting } from './types';
import {
  getBasePublications,
  getBaseMeetings,
  getCustomPublications,
  getCustomMeetings,
} from './data/contentStore';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Publications } from './components/Publications';
import { Meetings } from './components/Meetings';
import { CalendarView } from './components/CalendarView';
import { Team } from './components/Team';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('teic_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('teic_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('teic_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // Publications state (loaded from repository markdown files)
  const [customPubs] = useState<Publication[]>(() => getCustomPublications());
  const publications = useMemo(() => {
    const base = getBasePublications();
    return [...customPubs, ...base];
  }, [customPubs]);

  // Meetings state (loaded from repository markdown files)
  const [customMeetings] = useState<Meeting[]>(() => getCustomMeetings());
  const meetings = useMemo(() => {
    const base = getBaseMeetings();
    return [...customMeetings, ...base];
  }, [customMeetings]);

  return (
    <div className="min-h-screen bg-[#1C3728] text-[#E7E3D3] flex flex-col font-sans selection:bg-[#E7E3D3] selection:text-[#162B1F]">
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main One-Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Publications Section */}
        <Publications
          publications={publications}
        />

        {/* Meetings Section (Single upcoming meeting with agenda & notes) */}
        <Meetings
          meetings={meetings}
        />

        {/* Interactive Calendar Section */}
        <CalendarView meetings={meetings} />

        {/* Team / People Involved Section */}
        <Team />

        {/* Contact & Join Form Section */}
        <ContactForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
