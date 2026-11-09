import React from 'react';
import { TEAM_MEMBERS } from '../data/teamData';

export const Team: React.FC = () => {
  return (
    <section id="people" className="py-16 lg:py-24 border-b border-[#294B37] bg-[#162B1F]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <p className="text-xs uppercase tracking-widest font-sans font-semibold text-[#BCB6A4] mb-2">
            Foireann · Leadership & Researchers
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F1E4]">
            People Involved in TEIC
          </h2>
        </div>

        {/* Minimalist Team Grid: only Name & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-xl bg-[#224231] border border-[#355D46] shadow-sm hover:border-[#4B8263] transition-colors"
            >
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#F5F1E4]">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-[#E7E3D3] mt-1.5">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
