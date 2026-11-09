import React from 'react';
import { Languages, Network, Share2 } from 'lucide-react';

interface Pillar {
  index: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: React.ReactNode;
  focusAreas: string[];
}

export const About: React.FC = () => {
  const pillars: Pillar[] = [
    {
      index: '01',
      title: 'Digital Immersion & Technological Equity',
      icon: Languages,
      description:
        'Immersion is no longer limited to physical spaces like the Gaeltacht: it extends to the digital destinations we visit on our devices every day. TEIC bridges the digital inequality gap that locks Gaeilgeoirí and low-resource language communities out of modern technology. By engineering intelligent language software, our research transforms digital environments from language barriers into engines of revival.',
      focusAreas: [
        'Diagnostic Suite: Benchmarking grammatical diagnostics, syntax, and accuracy for intelligent language processing.',
        'Intelligent Experiences: Creating interactive conversational experiences and language tools for fluid language use.',
        'Cultural Preservation: TEIC views recent NLP advancements as an opportunity to preserve and respect Gaeilge (in all its forms) as a cultural artifact.',
      ],
    },
    {
      index: '02',
      title: 'The Irish Tech Ecosystem',
      icon: Network,
      description:
        'TEIC serves as inter-institutional collective bringing Irish to modern digital spaces. We collaborate with the intention of building technology that empowers speakers.',
      focusAreas: [
        'Inter-Institutional Working Groups: Harnessing the international technical talent interested in researching Irish language technology.',
        'Civic & Academic Alliances: Partnering with grassroots developers, digital Gaeilgeoirí, and open-source advocates to foster inclusive online destinations.',
        'Cross-Lab Talent Exchange: Facilitating collaborative research, weekly assemblies, and interdisciplinary skill sharing.',
        'Research Anchor (UL & CSIS): Grounded at the Department of Computer Science and Information Systems (CSIS), University of Limerick, driving nationwide collaboration.',
      ],
    },
    {
      index: '03',
      title: 'Shared Resources & Effort',
      icon: Share2,
      description:
        'Intelligent systems learn from representative data. Better representation (i.e. from native speakers, different dialects & demographics) produces better systems. With Irish representing less than 0.1% of web content, TEIC coordinates shared infrastructure and language resources.',
      focusAreas: [
        'Open-Access Curated Corpora: Building diverse, representative datasets to overcome the <0.1% web representation barrier and eliminate linguistic bias.',
        'Public Benchmark Leaderboards: Establishing transparent evaluation standards to measure and elevate Irish computational performance across platforms.',
        'Permissive Open-Source Tooling: Developing shared codebases, custom platform filters, and digital utilities for the broader community.',
        'Shared Computational Infrastructure: Pooling high-performance compute and pre-training resources to enable efficient, collective system development.',
      ],
    },
  ];

  return (
    <section id="about" className="py-16 lg:py-24 border-b border-[#294B37] bg-[#162B1F]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs uppercase tracking-widest font-sans font-semibold text-[#BCB6A4] mb-2">
            Mission & Core Focus
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F1E4]">
            Harnessing Ireland's Technological Talent Through Inter-Institutional Collaboration
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#C8C2AF] leading-relaxed">
            Across Ireland, technical efforts for Irish communities and the Irish language have long been scattered across separate institutions. TEIC operates on the principle of uniting international talent to concentrate effort on digital immersion, an interconnected tech ecosystem, and shared open resources.
          </p>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.index}
                className="p-6 sm:p-7 rounded-xl bg-[#224231] border border-[#355D46] shadow-sm hover:border-[#4B8263] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-[#918B7A] tracking-wider font-medium">
                      {pillar.index} / CORE FOCUS
                    </span>
                    <Icon className="w-5 h-5 text-[#E7E3D3]" />
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#F5F1E4] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#C8C2AF] leading-relaxed mb-5">
                    {pillar.description}
                  </p>

                  {/* Focus areas list */}
                  <div className="space-y-2 pt-3 border-t border-[#294B37]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#E7E3D3] block mb-2 font-semibold">
                      Key Research Initiatives:
                    </span>
                    {pillar.focusAreas.map((area, idx) => {
                      const colonIdx = area.indexOf(':');
                      if (colonIdx !== -1) {
                        const titlePart = area.slice(0, colonIdx);
                        const descPart = area.slice(colonIdx + 1);
                        return (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#C8C2AF] leading-normal">
                            <span className="text-[#E7E3D3] mt-0.5 shrink-0">·</span>
                            <span>
                              <strong className="text-[#F5F1E4] font-semibold">{titlePart}:</strong>
                              {descPart}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#C8C2AF]">
                          <span className="text-[#E7E3D3] mt-0.5 shrink-0">·</span>
                          <span>{area}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
