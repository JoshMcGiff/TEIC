import { Publication, Meeting } from '../types';
import { markdownToPublication, markdownToMeeting } from '../utils/markdownParser';

// Vite eager glob imports for markdown files
const publicationFiles = import.meta.glob('../content/publications/*.md', {
  query: '?raw',
  eager: true,
}) as Record<string, { default: string } | string>;

const meetingFiles = import.meta.glob('../content/meetings/*.md', {
  query: '?raw',
  eager: true,
}) as Record<string, { default: string } | string>;

const STORAGE_CUSTOM_PUBS_KEY = 'teic_custom_publications_md';
const STORAGE_CUSTOM_MEETINGS_KEY = 'teic_custom_meetings_md';

/**
 * Load default static publications from repository markdown files
 */
export function getBasePublications(): Publication[] {
  const list: Publication[] = [];
  for (const [path, mod] of Object.entries(publicationFiles)) {
    const rawContent = typeof mod === 'string' ? mod : mod.default;
    const filename = path.split('/').pop()?.replace('.md', '') || '';
    try {
      const pub = markdownToPublication(rawContent, filename);
      list.push(pub);
    } catch (err) {
      console.warn(`Failed to parse publication at ${path}:`, err);
    }
  }
  // Sort by date descending
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Load default static meetings from repository markdown files
 */
export function getBaseMeetings(): Meeting[] {
  const list: Meeting[] = [];
  for (const [path, mod] of Object.entries(meetingFiles)) {
    const rawContent = typeof mod === 'string' ? mod : mod.default;
    const filename = path.split('/').pop()?.replace('.md', '') || '';
    try {
      const meeting = markdownToMeeting(rawContent, filename);
      list.push(meeting);
    } catch (err) {
      console.warn(`Failed to parse meeting at ${path}:`, err);
    }
  }
  // Sort upcoming first, then recent
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Load custom user-added markdown entries stored in browser local storage
 */
export function getCustomPublications(): Publication[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PUBS_KEY);
    if (!raw) return [];
    const mdList: string[] = JSON.parse(raw);
    return mdList.map((md, idx) => markdownToPublication(md, `custom-pub-${idx + 1}`));
  } catch {
    return [];
  }
}

export function getCustomMeetings(): Meeting[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_MEETINGS_KEY);
    if (!raw) return [];
    const mdList: string[] = JSON.parse(raw);
    return mdList.map((md, idx) => markdownToMeeting(md, `custom-meeting-${idx + 1}`));
  } catch {
    return [];
  }
}

/**
 * Save new custom markdown publication into local storage
 */
export function saveCustomPublication(markdownText: string): Publication {
  const existingRaw = localStorage.getItem(STORAGE_CUSTOM_PUBS_KEY);
  const list: string[] = existingRaw ? JSON.parse(existingRaw) : [];
  list.unshift(markdownText);
  localStorage.setItem(STORAGE_CUSTOM_PUBS_KEY, JSON.stringify(list));
  return markdownToPublication(markdownText, `custom-pub-${Date.now()}`);
}

/**
 * Save new custom markdown meeting into local storage
 */
export function saveCustomMeeting(markdownText: string): Meeting {
  const existingRaw = localStorage.getItem(STORAGE_CUSTOM_MEETINGS_KEY);
  const list: string[] = existingRaw ? JSON.parse(existingRaw) : [];
  list.unshift(markdownText);
  localStorage.setItem(STORAGE_CUSTOM_MEETINGS_KEY, JSON.stringify(list));
  return markdownToMeeting(markdownText, `custom-meeting-${Date.now()}`);
}

/**
 * Clear custom storage
 */
export function clearCustomEntries() {
  localStorage.removeItem(STORAGE_CUSTOM_PUBS_KEY);
  localStorage.removeItem(STORAGE_CUSTOM_MEETINGS_KEY);
}

/**
 * Markdown templates for authors
 */
export const SAMPLE_PUBLICATION_TEMPLATE = `---
title: "Community-Led Broadband Cooperatives in West Cork: A Five-Year Retrospective"
date: "${new Date().toISOString().slice(0, 10)}"
year: ${new Date().getFullYear()}
authors:
  - "Dr. Cormac O'Sullivan"
  - "Local Community Contributor"
venue: "Irish Journal of Community Informatics & Civic Technology"
type: "journal"
doi: "10.1145/example.2026.101"
pdfUrl: "#"
codeUrl: "https://github.com/teic-research/west-cork-telemetry"
topics:
  - "Rural Connectivity"
  - "Civic Data & Governance"
featured: false
abstract: "An empirical evaluation of community-operated wireless relay towers along the Beara Peninsula, showing an 87% reduction in household connectivity drops during seasonal winter squalls and establishing sustainable voluntary maintenance rotas."
---

# Community-Led Broadband Cooperatives in West Cork

## Introduction
Documenting how local volunteer technical committees successfully bridged the high-speed fibre gap across rural townlands.

## Findings & Field Results
- **Battery Buffering**: Small 48V LiFePO4 batteries kept hilltop relays online during local storm outages.
- **Participation**: 94 family farms and local fishermen co-invested in relay nodes.

## Conclusion
Open hardware and cooperative governance offer viable models when commercial providers fail remote regions.
`;

export const SAMPLE_MEETING_TEMPLATE = `---
title: "Weekly Research Meeting: Irish NLP & Civic Technology"
date: "2026-11-26"
time: "11:00 - 12:30 IST (Every Thursday)"
location: "CSIS Building, University of Limerick (UL) & Microsoft Teams"
isUpcoming: true
contactPerson: "Josh McGiff (josh.mcgiff@ul.ie)"
hybridLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_teic_weekly%40thread.v2/0"
slidesUrl: "#"
topics:
  - "Digital Immersion for Irish"
  - "Irish Tech Ecosystem"
  - "Shared Resources & Effort"
agenda:
  - "Introduction + welcome"
  - "Objectives of the group"
  - "Overview of what we are working on"
---

# Weekly Research Meeting: Irish NLP & Civic Technology

## Meeting Overview
Join the TEIC research team every Thursday at 11:00 AM in the CSIS Building at the University of Limerick (UL) or online via Microsoft Teams. We welcome students, researchers, community partners, and technologists working to empower Irish communities through collaborative technology.
`;
