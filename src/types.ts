export type PublicationType = 'journal' | 'conference' | 'policy-brief' | 'whitepaper' | 'report';

export interface Publication {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  date: string; // YYYY-MM-DD
  year: number;
  venue: string;
  type: PublicationType;
  abstract: string;
  topics: string[];
  doi?: string;
  url?: string;
  pdfUrl?: string;
  codeUrl?: string;
  scholarUrl?: string;
  bibtex: string;
  markdownContent?: string;
  featured?: boolean;
}

export interface Meeting {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "14:00 - 15:30 IST"
  location: string;
  isUpcoming: boolean;
  topics: string[];
  agenda: string[];
  hybridLink?: string;
  minutesMarkdown?: string;
  recordingUrl?: string;
  slidesUrl?: string;
  contactPerson?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  institution?: string;
  location?: string;
  bio?: string;
  researchFocus?: string[];
  email?: string;
  scholarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface ContactInquiry {
  fullName: string;
  email: string;
  organization?: string;
  message: string;
  date: string;
}
