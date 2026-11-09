import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import teicLogo from '../assets/aistudio/New_Project__17__4e8eb2ef.png';

interface NavbarProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Publications', href: '#publications' },
    { label: 'Meetings', href: '#meetings' },
    { label: 'Calendar', href: '#calendar' },
    { label: 'People', href: '#people' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isScrolled
          ? 'bg-[#162B1F]/95 backdrop-blur-md border-b border-[#355D46]'
          : 'bg-[#1C3728] border-b border-[#294B37]'
      }`}
    >
      {/* Strict Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark / Logo */}
        <a
          href="#"
          className="flex items-center gap-3 sm:gap-4 group whitespace-nowrap shrink-0"
          title="TEIC - Technology for Empowering Irish Communities"
        >
          <img
            src={teicLogo}
            alt="TEIC"
            className="h-8 sm:h-9.5 md:h-10 w-auto object-contain transition-opacity group-hover:opacity-90 shrink-0"
          />
          <span className="text-xs sm:text-sm md:text-base font-sans font-semibold text-[#E7E3D3] group-hover:text-[#F5F1E4] tracking-tight transition-colors hidden sm:inline-block">
            Technology for Empowering Irish Communities
          </span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C8C2AF]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#F5F1E4] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="px-4 py-2 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Join Efforts
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#E7E3D3] hover:bg-[#224231] rounded-md"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drop */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#355D46] bg-[#162B1F] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#E7E3D3] hover:bg-[#224231] rounded-md"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#355D46] flex items-center justify-end">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] rounded-md"
            >
              Join Efforts
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
