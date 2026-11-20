import React, { useState, useMemo } from 'react';
import { Meeting } from '../types';
import {
  downloadICalFile,
  getGoogleCalendarLink,
  downloadMonthlyRecurringICal,
  formatHumanDate,
} from '../utils/markdownParser';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Video, Download, ExternalLink } from 'lucide-react';

interface CalendarViewProps {
  meetings: Meeting[];
  onSelectMeeting?: (meeting: Meeting) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ meetings, onSelectMeeting }) => {
  // Current viewed month: default to current date or month of next upcoming meeting
  const [currentDate, setCurrentDate] = useState(() => {
    // If there is an upcoming meeting, start on that month
    const upcoming = meetings.find((m) => m.isUpcoming);
    if (upcoming) {
      const [y, m] = upcoming.date.split('-');
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
    }
    return new Date(2026, 10, 1); // November 2026
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January / Eanáir',
    'February / Feabhra',
    'March / Márta',
    'April / Aibreán',
    'May / Bealtaine',
    'June / Meitheamh',
    'July / Iúil',
    'August / Lúnasa',
    'September / Meán Fómhair',
    'October / Deireadh Fómhair',
    'November / Samhain',
    'December / Nollaig',
  ];

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  // Map of meetings in this month by day
  const meetingsByDay = useMemo(() => {
    const map: Record<number, Meeting[]> = {};

    // 1. Populate custom or static markdown meetings
    meetings.forEach((m) => {
      const [mY, mM, mD] = m.date.split('-').map(Number);
      if (mY === year && mM === month + 1) {
        if (!map[mD]) map[mD] = [];
        map[mD].push(m);
      }
    });

    // 2. For future months from Jan 2027 onwards, populate the monthly 3rd Thursday gathering if no explicit markdown file exists
    const isFutureProjectionMonth = year > 2026;
    if (isFutureProjectionMonth) {
      let thursdayCount = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const dayOfWeek = new Date(year, month, d).getDay(); // 4 = Thursday
        if (dayOfWeek === 4) {
          thursdayCount += 1;
          if (thursdayCount === 3 && (!map[d] || map[d].length === 0)) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isUpcoming = new Date(year, month, d, 12, 30).getTime() >= new Date().getTime();
            map[d] = [
              {
                id: `monthly-thursday-${dateStr}`,
                slug: `monthly-meeting-${dateStr}`,
                title: 'Monthly Meeting: Technology for Empowering Irish Communities',
                date: dateStr,
                time: '11:00 AM IST (Thursday)',
                location: 'CSIS Building, University of Limerick (UL) & Online on Microsoft Teams',
                isUpcoming,
                topics: ['Digital Immersion for Irish', 'Irish Tech Ecosystem', 'Shared Resources & Effort', 'Low-Resource NLP'],
                agenda: [
                  'Welcome & project check-in',
                  'Cross-institutional collaboration updates',
                  'Open technical discussion & next steps',
                ],
                contactPerson: 'josh.mcgiff@ul.ie',
              },
            ];
          }
        }
      }
    }

    return map;
  }, [meetings, year, month, daysInMonth]);

  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(() => {
    const upcoming = meetings.find((m) => m.isUpcoming);
    return upcoming ? upcoming.id : meetings[0]?.id || null;
  });

  const selectedMeeting = useMemo(() => {
    const found = meetings.find((m) => m.id === selectedMeetingId);
    if (found) return found;

    for (const dayList of Object.values(meetingsByDay)) {
      const match = dayList.find((m) => m.id === selectedMeetingId);
      if (match) return match;
    }
    return meetings[0] || Object.values(meetingsByDay)[0]?.[0] || null;
  }, [meetings, selectedMeetingId, meetingsByDay]);

  // Export all upcoming meetings to a single .ics file
  const handleExportAllToICal = () => {
    const icsArray = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TEIC Research Group//Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    meetings.forEach((m) => {
      const dateClean = m.date.replace(/-/g, '');
      icsArray.push(
        'BEGIN:VEVENT',
        `UID:${m.id}-${dateClean}@teic-research.org`,
        `DTSTAMP:${dateClean}T110000Z`,
        `DTSTART:${dateClean}T110000Z`,
        `DTEND:${dateClean}T123000Z`,
        `SUMMARY:TEIC: ${m.title}`,
        `DESCRIPTION:${m.topics.join(', ')} - ${m.location}`,
        `LOCATION:${m.location}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    icsArray.push('END:VCALENDAR');
    const icsContent = icsArray.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teic-all-meetings.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="calendar" className="py-16 lg:py-24 border-b border-[#294B37] bg-[#1C3728]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 text-xs uppercase tracking-widest font-sans font-semibold text-[#BCB6A4] mb-2">
              <span className="text-[#E7E3D3]">Cruinnithe</span>
              <span className="hidden sm:inline text-[#4B8263]" aria-hidden="true">—</span>
              <span className="text-[#918B7A]">Monthly Meetings & Working Groups</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F1E4]">
              Interactive Meetings Calendar
            </h2>
            <p className="mt-2 text-sm text-[#C8C2AF] max-w-2xl">
              TEIC gathers <strong className="text-[#F5F1E4] font-semibold">monthly at 11:00 AM IST</strong> in the CSIS Building at the University of Limerick (UL) and online via Microsoft Teams. Our next meeting is on <strong className="text-[#F5F1E4] font-semibold">Thursday, 17 December 2026</strong>. Click any highlighted date to inspect details or download calendar invites.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={downloadMonthlyRecurringICal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#162B1F]" />
              <span>Monthly Series (.ics)</span>
            </button>

            <button
              onClick={handleExportAllToICal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#E7E3D3] bg-[#224231] border border-[#355D46] hover:bg-[#294F3C] rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#E7E3D3]" />
              <span>Export All (.ics)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Calendar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Grid (Col 7) */}
          <div className="lg:col-span-7 p-6 sm:p-7 rounded-xl bg-[#224231] border border-[#355D46] shadow-sm">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#294B37]">
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#F5F1E4]">
                {monthNames[month]} {year}
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={goToToday}
                  className="px-2.5 py-1 text-xs font-medium text-[#E7E3D3] hover:bg-[#162B1F] rounded-md transition-colors mr-1 border border-[#355D46]"
                >
                  Today
                </button>
                <button
                  onClick={prevMonth}
                  aria-label="Previous Month"
                  className="p-1.5 text-[#C8C2AF] hover:text-[#F5F1E4] hover:bg-[#162B1F] rounded-md transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  aria-label="Next Month"
                  className="p-1.5 text-[#C8C2AF] hover:text-[#F5F1E4] hover:bg-[#162B1F] rounded-md transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
                <div
                  key={label}
                  className="text-xs py-1 rounded text-[#BCB6A4] font-semibold"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty padding cells before first day */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-lg bg-[#162B1F]/30" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayMeetings = meetingsByDay[dayNum] || [];
                const hasMeetings = dayMeetings.length > 0;
                const isSelected = dayMeetings.some((m) => m.id === selectedMeetingId);

                return (
                  <button
                    key={`day-${dayNum}`}
                    onClick={() => {
                      if (hasMeetings) {
                        setSelectedMeetingId(dayMeetings[0].id);
                        if (onSelectMeeting) onSelectMeeting(dayMeetings[0]);
                      }
                    }}
                    disabled={!hasMeetings}
                    className={`h-14 sm:h-16 p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-[#E7E3D3] bg-[#E7E3D3] text-[#162B1F] shadow-sm'
                        : hasMeetings
                        ? 'border-[#47795C] bg-[#162B1F] hover:border-[#E7E3D3] cursor-pointer'
                        : 'border-transparent text-[#918B7A] cursor-default'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono tabular-nums font-medium ${
                        isSelected
                          ? 'text-[#162B1F] font-bold'
                          : hasMeetings
                          ? 'text-[#F5F1E4] font-bold'
                          : 'text-[#918B7A]'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {hasMeetings && (
                      <div className="w-full">
                        <div
                          className={`text-[10px] leading-tight font-medium truncate ${
                            isSelected ? 'text-[#162B1F] font-semibold' : 'text-[#E7E3D3]'
                          }`}
                        >
                          {dayMeetings[0].title.split(':')[0]}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Meeting Details Panel (Col 5) */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-xl bg-[#224231] border border-[#355D46] shadow-sm">
            {selectedMeeting ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#294B37]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#E7E3D3] font-semibold">
                    {selectedMeeting.isUpcoming ? 'Upcoming Gathering' : 'Past Meeting'}
                  </span>
                  <span className="text-xs font-serif font-bold text-[#F5F1E4]">
                    {formatHumanDate(selectedMeeting.date)}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#F5F1E4] leading-snug">
                  {selectedMeeting.title}
                </h3>

                {/* Logistics */}
                <div className="space-y-2 text-xs text-[#C8C2AF]">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#E7E3D3] shrink-0 mt-0.5" />
                    <span>{selectedMeeting.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#E7E3D3] shrink-0 mt-0.5" />
                    <span>{selectedMeeting.location}</span>
                  </div>
                  {selectedMeeting.hybridLink && (
                    <div className="flex items-start gap-2">
                      <Video className="w-4 h-4 text-[#E7E3D3] shrink-0 mt-0.5" />
                      <a
                        href={selectedMeeting.hybridLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#E7E3D3] hover:text-[#F5F1E4] hover:underline break-all font-medium"
                      >
                        Join on Microsoft Teams
                      </a>
                    </div>
                  )}
                </div>

                {/* Topics (clean text metadata with separators, no pills) */}
                <div className="pt-2 text-xs text-[#BCB6A4]">
                  <span className="font-semibold text-[#E7E3D3]">Key Themes: </span>
                  {(selectedMeeting.topics || []).join(' · ')}
                </div>

                {/* Context link to full meeting section notes */}
                <div className="p-3 rounded-lg bg-[#162B1F] border border-[#355D46] text-xs text-[#C8C2AF]">
                  <p className="leading-relaxed">
                    Full agendas and discussion summaries are detailed in the{' '}
                    <a
                      href="#meetings"
                      className="text-[#E7E3D3] font-semibold underline hover:text-[#F5F1E4]"
                    >
                      Meetings & Discussion Summaries
                    </a>{' '}
                    section.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#294B37] flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => downloadICalFile(selectedMeeting)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E7E3D3] bg-[#162B1F] hover:bg-[#294F3C] border border-[#355D46] rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .ics</span>
                  </button>

                  <a
                    href={getGoogleCalendarLink(selectedMeeting)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-md transition-colors"
                  >
                    <span>Add to Google Calendar</span>
                    <ExternalLink className="w-3 h-3 text-[#162B1F]" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#BCB6A4] text-xs">
                Select a highlighted date in the calendar to view meeting details.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
