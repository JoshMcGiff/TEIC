import React from 'react';
import { ArrowDown, BookOpen, Calendar, MapPin, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 border-b border-[#294B37] bg-[#1C3728]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Split: Headline & Prose on Left, Hero Field Image / Logo on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F5F1E4] leading-[1.15] text-balance">
              Technology for Empowering Irish Communities
            </h1>

            <p className="text-base sm:text-lg text-[#C8C2AF] leading-relaxed max-w-2xl">
              Uniting Ireland's technical talent to foster digital immersion for Irish & low-resource language speakers, galvanise an interconnected Irish tech ecosystem, and pool shared open resources and effort into language empowerment. Founded by <strong className="text-[#F5F1E4] font-semibold">Josh McGiff</strong>, a PhD student in Natural Language Processing at the <strong className="text-[#F5F1E4] font-semibold">University of Limerick (UL)</strong>, with senior advisement from <strong className="text-[#F5F1E4] font-semibold">Dr. Nikola S. Nikolov</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#publications"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-lg transition-colors shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Publications</span>
              </a>

              <a
                href="#calendar"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#E7E3D3] bg-[#224231] hover:bg-[#294F3C] border border-[#355D46] rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#E7E3D3]" />
                <span>Meetings & Calendar</span>
              </a>
            </div>

            {/* Zero-pill inline metadata with typographic separators */}
            <div className="pt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#BCB6A4]">
              <span className="font-semibold text-[#E7E3D3]">Core Focus:</span>
              <span className="text-[#F5F1E4]">Digital Immersion for Irish & Low-Resource Languages</span>
              <span aria-hidden="true" className="text-[#355D46]">·</span>
              <span className="text-[#F5F1E4]">Irish Tech Ecosystem</span>
              <span aria-hidden="true" className="text-[#355D46]">·</span>
              <span className="text-[#F5F1E4]">Shared Resources & Effort</span>
            </div>
          </div>

          {/* Right Column: Uncropped official TEIC logo visual */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-[#355D46] shadow-sm bg-[#162B1F] p-4 sm:p-6 flex items-center justify-center">
              <img
                src="/assets/aistudio/New_Project__15__9a17a30b.png"
                alt="TEIC - Technology for Empowering Irish Communities"
                className="w-full h-auto max-h-72 sm:max-h-80 object-contain rounded-lg"
              />
            </div>

            {/* Research Base Sub-card */}
            <div className="p-4 rounded-xl bg-[#224231] border border-[#355D46] flex items-center justify-between gap-4">
              <div className="text-xs text-[#C8C2AF]">
                <div className="font-semibold text-[#F5F1E4] text-xs">University of Limerick Research Base</div>
                <div className="text-[11px] text-[#BCB6A4] mt-0.5">Department of Computer Science & Information Systems</div>
              </div>
              <img
                src="/assets/aistudio/New_Project__17__4e8eb2ef.png"
                alt="TEIC Official Emblem"
                className="h-8 w-auto object-contain shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Operational Utility Ribbon */}
        <div className="mt-12 pt-6 border-t border-[#294B37] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#BCB6A4]">
          <div>
            <div className="font-semibold text-[#E7E3D3] uppercase tracking-wider text-[11px]">Research Base</div>
            <div className="mt-0.5">University of Limerick (UL)</div>
          </div>
          <div>
            <div className="font-semibold text-[#E7E3D3] uppercase tracking-wider text-[11px]">ran by</div>
            <div className="mt-0.5 font-medium text-[#F5F1E4]">Josh McGiff & Dr. Nikola S. Nikolov</div>
          </div>
          <div>
            <div className="font-semibold text-[#E7E3D3] uppercase tracking-wider text-[11px]">Weekly meeting</div>
            <div className="mt-0.5 font-semibold text-[#F5F1E4]">Every Thursday @ 11:00 AM · CSIS (UL) & Teams</div>
          </div>
        </div>
      </div>
    </section>
  );
};
