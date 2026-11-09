import { marked } from 'marked';
import { Publication, Meeting } from '../types';

/**
 * Lightweight frontmatter parser that extracts key-value pairs between --- lines
 */
export function parseFrontmatter(markdownText: string): { data: Record<string, any>; content: string } {
  const trimmed = markdownText.trim();
  if (!trimmed.startsWith('---')) {
    return { data: {}, content: markdownText };
  }

  const endMatch = trimmed.indexOf('\n---', 3);
  if (endMatch === -1) {
    return { data: {}, content: markdownText };
  }

  const frontmatterBlock = trimmed.slice(3, endMatch).trim();
  const content = trimmed.slice(endMatch + 4).trim();

  const data: Record<string, any> = {};
  const lines = frontmatterBlock.split('\n');

  let currentKey = '';
  let inArray = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Array item
    if (line.startsWith('- ') && inArray && currentKey) {
      const val = line.slice(2).trim().replace(/^["']|["']$/g, '');
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(val);
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();

      // Check if starting list
      if (!value) {
        currentKey = key;
        inArray = true;
        data[key] = [];
        continue;
      }

      inArray = false;
      currentKey = key;

      // Handle bracket array: ["val1", "val2"]
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          // simple parser for ["a", "b"]
          const items = value
            .slice(1, -1)
            .split(',')
            .map((s) => s.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
          data[key] = items;
          continue;
        } catch {
          // fallback
        }
      }

      // Boolean
      if (value.toLowerCase() === 'true') {
        data[key] = true;
        continue;
      }
      if (value.toLowerCase() === 'false') {
        data[key] = false;
        continue;
      }

      // Number
      if (!isNaN(Number(value)) && value !== '') {
        data[key] = Number(value);
        continue;
      }

      // Strip quotes
      value = value.replace(/^["']|["']$/g, '');
      data[key] = value;
    }
  }

  return { data, content };
}

/**
 * Render Markdown to HTML using marked
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  try {
    return marked.parse(markdown, { async: false, gfm: true, breaks: true }) as string;
  } catch (err) {
    console.error('Error parsing markdown:', err);
    return markdown;
  }
}

/**
 * Convert Markdown text into a Publication object
 */
export function markdownToPublication(markdownRaw: string, fallbackId = ''): Publication {
  const { data, content } = parseFrontmatter(markdownRaw);
  const slug = (data.slug || data.title || fallbackId || 'publication')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const rawAuthors = Array.isArray(data.authors)
    ? data.authors
    : typeof data.authors === 'string'
    ? data.authors.split(',').map((a: string) => a.trim())
    : ['TEIC Research Group'];

  const authors: string[] = [];
  for (const a of rawAuthors) {
    if (typeof a === 'string') {
      const trimmed = a.trim();
      if (trimmed.includes('Adam Burke') && trimmed.includes("Barry O'Sullivan") && !trimmed.includes(',')) {
        authors.push('Adam Burke', "Barry O'Sullivan");
      } else {
        authors.push(trimmed);
      }
    }
  }

  const topics = Array.isArray(data.topics)
    ? data.topics
    : typeof data.topics === 'string'
    ? data.topics.split(',').map((t: string) => t.trim())
    : ['Civic Technology'];

  const date = data.date || new Date().toISOString().slice(0, 10);
  const year = data.year || parseInt(date.slice(0, 4), 10) || 2026;

  // Auto-generate BibTeX if missing
  const primaryAuthorLast = authors[0]?.split(' ').pop() || 'TEIC';
  const bibtexKey = `${primaryAuthorLast.toLowerCase()}${year}${slug.split('-')[0]}`;
  const defaultBibtex = `@article{${bibtexKey},
  title = {${data.title || 'Untitled Research'}},
  author = {${authors.join(' and ')}},
  journal = {${data.venue || 'TEIC Working Papers'}},
  year = {${year}},
  url = {${data.doi ? `https://doi.org/${data.doi}` : `https://teic-research.org/pubs/${slug}`}}
}`;

  return {
    id: data.id || fallbackId || slug,
    slug,
    title: data.title || 'Untitled Publication',
    authors,
    date,
    year,
    venue: data.venue || 'TEIC Research Publications',
    type: data.type || 'journal',
    abstract: data.abstract || content.slice(0, 280) + '...',
    topics,
    doi: data.doi,
    url: data.url || data.paperUrl || data.pdfUrl,
    pdfUrl: data.pdfUrl || data.url || '#',
    codeUrl: data.codeUrl,
    scholarUrl: data.scholarUrl,
    bibtex: data.bibtex || defaultBibtex,
    markdownContent: content,
    featured: data.featured === true,
  };
}

/**
 * Convert Markdown text into a Meeting object
 */
export function markdownToMeeting(markdownRaw: string, fallbackId = ''): Meeting {
  const { data, content } = parseFrontmatter(markdownRaw);
  const slug = (data.slug || data.title || fallbackId || 'meeting')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const topics = Array.isArray(data.topics)
    ? data.topics
    : typeof data.topics === 'string'
    ? data.topics.split(',').map((t: string) => t.trim())
    : ['General Meeting'];

  const agenda = Array.isArray(data.agenda)
    ? data.agenda
    : typeof data.agenda === 'string'
    ? data.agenda.split(';').map((a: string) => a.trim())
    : [];

  const date = data.date || new Date().toISOString().slice(0, 10);
  const meetingDateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isUpcoming = data.isUpcoming !== undefined ? Boolean(data.isUpcoming) : meetingDateObj >= today;

  return {
    id: data.id || fallbackId || slug,
    slug,
    title: data.title || 'TEIC Weekly Research Meeting',
    date,
    time: data.time || '11:00 - 12:30 IST',
    location: data.location || 'CSIS Building, University of Limerick (UL) & Microsoft Teams',
    isUpcoming,
    topics,
    agenda,
    hybridLink: data.hybridLink || 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_teic_weekly%40thread.v2/0',
    minutesMarkdown: content,
    recordingUrl: data.recordingUrl,
    slidesUrl: data.slidesUrl,
    contactPerson: data.contactPerson || 'josh.mcgiff@ul.ie',
  };
}

/**
 * Generate iCalendar .ics format for a meeting
 */
export function generateICal(meeting: Meeting): string {
  // Format YYYYMMDDTHHMMSSZ (11:00 AM to 12:30 PM IST)
  const dateClean = meeting.date.replace(/-/g, '');
  const startTime = '110000';
  const endTime = '123000';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TEIC Research Group//Irish Communities Tech//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${meeting.id}-${dateClean}@teic-research.org`,
    `DTSTAMP:${dateClean}T110000Z`,
    `DTSTART:${dateClean}T${startTime}Z`,
    `DTEND:${dateClean}T${endTime}Z`,
    `SUMMARY:TEIC: ${meeting.title}`,
    `DESCRIPTION:${meeting.topics.join(', ')} - ${meeting.location}`,
    `LOCATION:${meeting.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

/**
 * Generate a recurring weekly Thursday series iCalendar file (.ics)
 */
export function generateWeeklyRecurringICal(): string {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TEIC Research Group//Weekly Meeting//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:teic-weekly-thursday-series@teic-research.org',
    'DTSTAMP:20261105T110000Z',
    'DTSTART;TZID=Europe/Dublin:20261105T110000',
    'DTEND;TZID=Europe/Dublin:20261105T123000',
    'RRULE:FREQ=WEEKLY;BYDAY=TH',
    'SUMMARY:TEIC Weekly Meeting (Every Thursday 11:00 AM)',
    'DESCRIPTION:Weekly research meeting of TEIC (Technology for Empowering Irish Communities). Discussing NLP for Irish, open civic technology, and cross-institutional collaboration. Open to all students, researchers, and community collaborators.',
    'LOCATION:CSIS Building, University of Limerick (UL) & Microsoft Teams',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

/**
 * Trigger download of iCalendar file
 */
export function downloadICalFile(meeting: Meeting) {
  const ics = generateICal(meeting);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `teic-meeting-${meeting.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger download of weekly recurring series .ics
 */
export function downloadWeeklyRecurringICal() {
  const ics = generateWeeklyRecurringICal();
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `teic-weekly-thursday-meetings.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Create a direct Google Calendar add link
 */
export function getGoogleCalendarLink(meeting: Meeting): string {
  const dateClean = meeting.date.replace(/-/g, '');
  const start = `${dateClean}T110000Z`;
  const end = `${dateClean}T123000Z`;
  const title = encodeURIComponent(`TEIC: ${meeting.title}`);
  const details = encodeURIComponent(
    `Topics: ${meeting.topics.join(', ')}\n\nAgenda:\n${meeting.agenda.map((a) => `• ${a}`).join('\n')}\n\nLocation: ${meeting.location}\n\nSchedule: Every Thursday at 11:00 AM in CSIS at UL or online on Microsoft Teams.`
  );
  const location = encodeURIComponent(meeting.location);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

/**
 * Create a recurring Google Calendar link for every Thursday at 11am
 */
export function getWeeklyGoogleCalendarLink(): string {
  const start = '20261105T110000Z';
  const end = '20261105T123000Z';
  const title = encodeURIComponent('TEIC Weekly Meeting (Every Thursday 11:00 AM)');
  const details = encodeURIComponent(
    'Weekly research gathering of TEIC - Technology for Empowering Irish Communities.\n\nTime: Every Thursday at 11:00 AM IST\nVenue: CSIS Building, University of Limerick (UL) or online on Microsoft Teams.\n\nFounder: Josh McGiff (UL NLP)\nAdvisement: Dr. Nikola S. Nikolov (UL CSIS)'
  );
  const location = encodeURIComponent('CSIS Building, University of Limerick (UL) & Microsoft Teams');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&recur=RRULE:FREQ=WEEKLY;BYDAY=TH&details=${details}&location=${location}`;
}

/**
 * Format ISO date string (YYYY-MM-DD) into human-readable text (e.g. Thursday, 19 November 2026)
 */
export function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    if (isNaN(dateObj.getTime())) return dateStr;
    const weekday = dateObj.toLocaleDateString('en-GB', { weekday: 'long' });
    const dmy = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${weekday}, ${dmy}`;
  } catch {
    return dateStr;
  }
}
