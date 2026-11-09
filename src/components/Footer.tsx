import React from 'react';
import { Github, Globe, FileText, Calendar, Mail, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#294B37] bg-[#162B1F] py-12 lg:py-16 text-xs text-[#BCB6A4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#294B37]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/New_Project__17__4e8eb2ef.png"
                alt="TEIC Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
              <span className="text-xs text-[#BCB6A4] border-l border-[#355D46] pl-2.5">
                Technology for Empowering Irish Communities
              </span>
            </div>
            <p className="text-xs text-[#C8C2AF] max-w-md leading-relaxed">
              An open research initiative at the University of Limerick (UL) dedicated to digital immersion for Irish, an interconnected tech ecosystem, and shared resources across Ireland.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <div className="font-semibold text-[#E7E3D3] uppercase tracking-wider text-[11px]">
              Explore
            </div>
            <ul className="space-y-1.5">
              <li>
                <a href="#about" className="hover:text-[#F5F1E4] transition-colors">
                  About the Research Group
                </a>
              </li>
              <li>
                <a href="#publications" className="hover:text-[#F5F1E4] transition-colors">
                  Recent Publications & Working Papers
                </a>
              </li>
              <li>
                <a href="#meetings" className="hover:text-[#F5F1E4] transition-colors">
                  Meetings & Agenda Topics
                </a>
              </li>
              <li>
                <a href="#calendar" className="hover:text-[#F5F1E4] transition-colors">
                  Interactive Meeting Calendar
                </a>
              </li>
              <li>
                <a href="#people" className="hover:text-[#F5F1E4] transition-colors">
                  People Involved & Fellows
                </a>
              </li>
            </ul>
          </div>

          {/* Institutional & Open Access */}
          <div className="space-y-2">
            <div className="font-semibold text-[#E7E3D3] uppercase tracking-wider text-[11px]">
              Open Science
            </div>
            <ul className="space-y-1.5">
              <li>
                <span className="text-[#BCB6A4]">University of Limerick (UL)</span>
              </li>
              <li>
                <span className="text-[#BCB6A4]">Hostable on GitHub Pages</span>
              </li>
              <li>
                <span className="text-[#BCB6A4]">Open Access Research</span>
              </li>
              <li>
                <a href="mailto:josh.mcgiff@ul.ie" className="hover:text-[#F5F1E4] transition-colors flex items-center gap-1 text-[#E7E3D3]">
                  <Mail className="w-3.5 h-3.5" />
                  <span>josh.mcgiff@ul.ie</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#918B7A]">
          <div>
            TEIC · Technology for Empowering Irish Communities · University of Limerick
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#BCB6A4]">Bilingual Research · Béarla & Gaeilge</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[#E7E3D3] hover:text-[#F5F1E4] transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
