import React, { useMemo } from 'react';
import { Meeting } from '../types';
import {
  renderMarkdown,
  downloadMonthlyRecurringICal,
  getMonthlyGoogleCalendarLink,
  formatHumanDate,
} from '../utils/markdownParser';
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  MessageSquare,
  Users,
} from 'lucide-react';

interface MeetingsProps {
  meetings: Meeting[];
}

export const Meetings: React.FC<MeetingsProps> = ({ meetings }) => {
  // Single upcoming meeting (first upcoming or fallback to first available meeting)
  const upcomingMeeting = useMemo(() => {
    const upcoming = meetings
      .filter((m) => m.isUpcoming)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] || meetings[0] || null;
  }, [meetings]);

  // Past meetings with discussion summaries (e.g. Inaugural Meeting)
  const pastMeetings = useMemo(() => {
    return meetings
      .filter((m) => !m.isUpcoming && m.id !== upcomingMeeting?.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [meetings, upcomingMeeting]);

  const hasNotes = Boolean(upcomingMeeting?.minutesMarkdown && upcomingMeeting.minutesMarkdown.trim().length > 10);

  return (
    <section id="meetings" className="py-16 lg:py-24 border-b border-[#294B37] bg-[#162B1F]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 text-xs uppercase tracking-widest font-sans font-semibold text-[#BCB6A4] mb-2">
              <span className="text-[#E7E3D3]">Cruinnithe & Nótaí</span>
              <span className="hidden sm:inline text-[#4B8263]" aria-hidden="true">—</span>
              <span className="text-[#918B7A]">Monthly Assembly & Summaries</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F1E4]">
              Meetings & Discussion Summaries
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#C8C2AF] max-w-2xl">
              TEIC gathers <strong className="text-[#F5F1E4] font-semibold">monthly at 11:00 AM IST</strong> in the CSIS Building at the University of Limerick (UL) and online on Microsoft Teams. Details for our next gathering and notes from our inaugural session are outlined below.
            </p>
          </div>
        </div>

        {/* Monthly Recurring Gathering Cadence Banner */}
        <div className="p-6 sm:p-7 rounded-xl bg-[#224231] border border-[#4B8263]/70 mb-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E7E3D3] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Monthly Meeting Cadence</span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F5F1E4] tracking-tight">
                  Monthly · Next: Thursday, 17 December 2026
                </h3>
                <div className="mt-2 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-[#C8C2AF]">
                  <div className="flex items-center gap-1.5 font-medium text-[#F5F1E4]">
                    <MapPin className="w-4 h-4 text-[#E7E3D3] shrink-0" />
                    <span>CSIS Building, University of Limerick (UL)</span>
                  </div>
                  <span className="hidden sm:inline text-[#355D46]">|</span>
                  <div className="flex items-center gap-1.5 font-medium text-[#E7E3D3]">
                    <Clock className="w-4 h-4 text-[#E7E3D3] shrink-0" />
                    <span>11:00 AM IST · Online on Microsoft Teams</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#BCB6A4] leading-relaxed">
                Open to all students, researchers, community partners, and technologists. Each monthly session focuses on digital immersion for Irish & low-resource language speakers, uniting the Irish tech ecosystem across institutions, and keeping publicly funded resources open.
              </p>
            </div>

            {/* Quick Actions for Monthly Series */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={downloadMonthlyRecurringICal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#162B1F]" />
                <span>Save Monthly Series (.ics)</span>
              </button>

              <a
                href={getMonthlyGoogleCalendarLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-[#BCB6A4] hover:text-[#F5F1E4] hover:bg-[#162B1F] border border-[#355D46] rounded-lg transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E7E3D3]" />
                <span>Add to Google Calendar</span>
              </a>
            </div>
          </div>
        </div>

        {/* Single Upcoming Meeting Card */}
        {upcomingMeeting && (
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E7E3D3] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Next Gathering Details</span>
            </div>

            <article className="p-6 sm:p-7 rounded-xl bg-[#224231] border border-[#4B8263]/80 ring-1 ring-[#4B8263]/40 shadow-sm transition-colors">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#F5F1E4]">
                    {upcomingMeeting.title}
                  </h3>
                </div>

                {/* Date badge */}
                <div className="font-mono text-xs sm:text-sm text-[#BCB6A4] sm:text-right shrink-0">
                  <span className="font-serif font-bold text-[#F5F1E4] text-sm sm:text-base block">
                    {formatHumanDate(upcomingMeeting.date)}
                  </span>
                  <span className="text-xs text-[#E7E3D3] block mt-0.5">{upcomingMeeting.time}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-[#C8C2AF] my-3">
                <MapPin className="w-3.5 h-3.5 text-[#BCB6A4]" />
                <span>{upcomingMeeting.location}</span>
              </div>

              {/* Topics */}
              {upcomingMeeting.topics && upcomingMeeting.topics.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#BCB6A4] mb-4 pt-2 border-t border-[#294B37]">
                  <span className="font-semibold text-[#E7E3D3]">Topics:</span>
                  {upcomingMeeting.topics.join(' · ')}
                </div>
              )}

              {/* Agenda Outline: a, b, c format without times */}
              {upcomingMeeting.agenda && upcomingMeeting.agenda.length > 0 && (
                <div className="mb-4 bg-[#162B1F] p-4 rounded-lg border border-[#355D46]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#E7E3D3] block mb-2 font-mono">
                    Meeting Agenda
                  </span>
                  <ul className="space-y-2 text-xs text-[#C8C2AF]">
                    {upcomingMeeting.agenda.map((item, idx) => {
                      const letter = String.fromCharCode(97 + idx); // a, b, c, ...
                      const cleanItem = item.replace(/^([0-9]{1,2}:[0-9]{2}\s*-\s*|[a-z]\)\s*)/i, '');
                      return (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="font-mono font-semibold text-[#E7E3D3] shrink-0">{letter})</span>
                          <span>{cleanItem}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Upcoming Focus Note */}
              {hasNotes && (
                <div className="mt-4 pt-4 border-t border-[#294B37] bg-[#162B1F]/60 p-4 sm:p-5 rounded-lg border border-[#355D46]/80">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#E7E3D3] mb-2 uppercase tracking-wider font-semibold">
                    <MessageSquare className="w-4 h-4 text-[#E7E3D3]" />
                    <span>Session Focus:</span>
                  </div>
                  <div
                    className="prose prose-invert max-w-none text-xs sm:text-sm text-[#E7E3D3] space-y-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(upcomingMeeting.minutesMarkdown || '') }}
                  />
                </div>
              )}
            </article>
          </div>
        )}

        {/* Past Meeting Summaries (Inaugural Meeting & Archive) */}
        {pastMeetings.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#BCB6A4] font-semibold">
              <Users className="w-3.5 h-3.5 text-[#E7E3D3]" />
              <span>Past Meeting Summaries</span>
            </div>

            <div className="space-y-5">
              {pastMeetings.map((meeting) => (
                <article
                  key={meeting.id}
                  className="p-6 sm:p-7 rounded-xl bg-[#224231]/80 border border-[#355D46] shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 pb-3 border-b border-[#294B37]">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#E7E3D3] block mb-1">
                        Meeting Summary · 30+ Participants
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#F5F1E4]">
                        {meeting.title}
                      </h3>
                    </div>

                    <div className="font-mono text-xs sm:text-sm text-[#BCB6A4] sm:text-right shrink-0">
                      <span className="font-serif font-bold text-[#F5F1E4] text-sm sm:text-base block">
                        {formatHumanDate(meeting.date)}
                      </span>
                      <span className="text-xs text-[#BCB6A4] block mt-0.5">{meeting.time}</span>
                    </div>
                  </div>

                  {meeting.topics && meeting.topics.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#BCB6A4] mb-4">
                      <span className="font-semibold text-[#E7E3D3]">Key Themes Discussed:</span>
                      {meeting.topics.join(' · ')}
                    </div>
                  )}

                  {meeting.minutesMarkdown && meeting.minutesMarkdown.trim().length > 0 && (
                    <div className="bg-[#162B1F]/70 p-4 sm:p-5 rounded-lg border border-[#355D46]/80">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#E7E3D3] mb-2.5 uppercase tracking-wider font-semibold">
                        <MessageSquare className="w-4 h-4 text-[#E7E3D3]" />
                        <span>Summary & Key Points Discussed</span>
                      </div>
                      <div
                        className="prose prose-invert max-w-none text-xs sm:text-sm text-[#E7E3D3] space-y-2 leading-relaxed [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:text-[#F5F1E4]"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(meeting.minutesMarkdown) }}
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
