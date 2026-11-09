import React, { useState, useMemo } from 'react';
import { Publication } from '../types';
import { Search, BookOpen, Copy, Check, ExternalLink, FileText } from 'lucide-react';

interface PublicationsProps {
  publications: Publication[];
}

export const Publications: React.FC<PublicationsProps> = ({
  publications,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);
  const [citationModalPub, setCitationModalPub] = useState<Publication | null>(null);
  const [modalCopied, setModalCopied] = useState(false);

  // Extract all unique topics
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    publications.forEach((p) => p.topics.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [publications]);

  // Filtered publications
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesTopic =
        selectedTopic === 'All' || pub.topics.includes(selectedTopic);
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesTopic;

      const matchesQuery =
        pub.title.toLowerCase().includes(query) ||
        pub.authors.some((a) => a.toLowerCase().includes(query)) ||
        pub.abstract.toLowerCase().includes(query) ||
        pub.venue.toLowerCase().includes(query) ||
        pub.topics.some((t) => t.toLowerCase().includes(query));

      return matchesTopic && matchesQuery;
    });
  }, [publications, selectedTopic, searchQuery]);

  const handleCopyBibtex = (pub: Publication) => {
    navigator.clipboard.writeText(pub.bibtex);
    setCopiedBibtexId(pub.id);
    setTimeout(() => setCopiedBibtexId(null), 2500);
  };

  const getApaCitation = (pub: Publication) => {
    const authorsFormatted = pub.authors.join(', ');
    return `${authorsFormatted} (${pub.year}). ${pub.title}. ${pub.venue}.${pub.doi ? ` https://doi.org/${pub.doi}` : ''}`;
  };

  const getHarvardCitation = (pub: Publication) => {
    const authorsFormatted = pub.authors.join(', ');
    return `${authorsFormatted}, ${pub.year}. ${pub.title}. ${pub.venue}.${pub.doi ? ` Available at: https://doi.org/${pub.doi}` : ''}`;
  };

  return (
    <section id="publications" className="py-16 lg:py-24 border-b border-[#294B37] bg-[#1C3728]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Add Markdown Entry Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 text-xs uppercase tracking-widest font-sans font-semibold text-[#BCB6A4] mb-2">
              <span className="text-[#E7E3D3]">Taighde & Foilseacháin</span>
              <span className="hidden sm:inline text-[#4B8263]" aria-hidden="true">—</span>
              <span className="text-[#918B7A]">Peer-Reviewed & Community Open Access</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F1E4]">
              Recent Publications & Working Papers
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#C8C2AF] max-w-2xl">
              All TEIC research is published under open access protocols. Easy maintenance is powered by simple Markdown files in the GitHub repository.
            </p>
          </div>
        </div>

        {/* Search & Topic Filter Controls */}
        <div className="space-y-4 mb-8">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918B7A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#162B1F] border border-[#355D46] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E7E3D3] text-[#F5F1E4] placeholder-[#918B7A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#BCB6A4] hover:text-[#F5F1E4]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#162B1F] rounded-lg w-fit border border-[#355D46]">
            {allTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedTopic === topic
                    ? 'bg-[#E7E3D3] text-[#162B1F] shadow-sm font-semibold'
                    : 'text-[#C8C2AF] hover:text-[#F5F1E4]'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Publications List */}
        {filteredPublications.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-[#355D46] bg-[#224231]/40">
            <FileText className="w-8 h-8 mx-auto text-[#918B7A] mb-3" />
            <p className="text-base font-serif text-[#F5F1E4] font-medium">
              No publications found matching your search.
            </p>
            <p className="text-xs text-[#BCB6A4] mt-1">
              Try adjusting your topic filter or search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All');
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-medium text-[#E7E3D3] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPublications.map((pub) => {
              const paperLink = pub.url || pub.pdfUrl;

              return (
                <article
                  key={pub.id}
                  className="p-6 sm:p-7 rounded-xl bg-[#224231] border border-[#355D46] shadow-sm hover:border-[#4B8263] transition-colors"
                >
                  {/* Lead Title & Type */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#F5F1E4] leading-snug">
                      {paperLink ? (
                        <a
                          href={paperLink}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[#E7E3D3] transition-colors inline-flex items-baseline gap-1.5 group"
                        >
                          <span>{pub.title}</span>
                          <ExternalLink className="w-4 h-4 text-[#BCB6A4] group-hover:text-[#E7E3D3] inline shrink-0" />
                        </a>
                      ) : (
                        pub.title
                      )}
                    </h3>
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#BCB6A4] mb-3 font-sans">
                    <span className="font-semibold text-[#E7E3D3]">{pub.venue}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pub.year}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{pub.type.replace('-', ' ')}</span>
                    {pub.doi && (
                      <>
                        <span aria-hidden="true">·</span>
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-[#F5F1E4] underline font-mono text-[11px]"
                        >
                          DOI: {pub.doi}
                        </a>
                      </>
                    )}
                  </div>

                  {/* Authors line */}
                  <div className="text-xs text-[#C8C2AF] mb-4 font-sans leading-relaxed">
                    <span className="text-[#918B7A]">Authors: </span>
                    {pub.authors.join(', ')}
                  </div>

                  {/* Abstract preview */}
                  <div className="text-sm text-[#C8C2AF] leading-relaxed mb-5 font-sans">
                    {pub.abstract}
                  </div>

                  {/* Topics tag-line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#BCB6A4] mb-5 pt-3 border-t border-[#294B37]">
                    <span className="font-semibold text-[#E7E3D3]">Topics:</span>
                    {pub.topics.map((t, idx) => (
                      <React.Fragment key={t}>
                        <button
                          onClick={() => setSelectedTopic(t)}
                          className="hover:text-[#F5F1E4] transition-colors"
                        >
                          {t}
                        </button>
                        {idx < pub.topics.length - 1 && <span aria-hidden="true">/</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Action Affordances */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {paperLink && (
                      <a
                        href={paperLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-md transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#162B1F]" />
                        <span>View Paper</span>
                      </a>
                    )}

                    <button
                      onClick={() => setCitationModalPub(pub)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E7E3D3] bg-[#162B1F] hover:bg-[#294F3C] border border-[#355D46] rounded-md transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#BCB6A4]" />
                      <span>Cite (BibTeX / APA)</span>
                    </button>

                    <button
                      onClick={() => handleCopyBibtex(pub)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E7E3D3] bg-[#162B1F] hover:bg-[#294F3C] border border-[#355D46] rounded-md transition-colors"
                    >
                      {copiedBibtexId === pub.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-medium">Copied BibTeX!</span>
                        </>
                      ) : (
                        <span>Quick BibTeX</span>
                      )}
                    </button>

                    {pub.scholarUrl && (
                      <a
                        href={pub.scholarUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E7E3D3] bg-[#162B1F] hover:bg-[#294F3C] border border-[#355D46] rounded-md transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#BCB6A4]" />
                        <span>Google Scholar</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Citation Drawer / Modal */}
        {citationModalPub && (
          <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
            <div className="bg-[#1C3728] rounded-xl max-w-2xl w-full p-6 border border-[#355D46] shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#294B37] pb-3">
                <h4 className="font-serif text-lg font-semibold text-[#F5F1E4]">
                  Export Citation
                </h4>
                <button
                  onClick={() => setCitationModalPub(null)}
                  className="text-[#BCB6A4] hover:text-[#F5F1E4] text-sm font-medium"
                >
                  ✕ Close
                </button>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#BCB6A4] uppercase tracking-wider block mb-1">
                  BibTeX
                </span>
                <pre className="p-3 bg-[#162B1F] rounded-lg text-xs font-mono text-[#E7E3D3] overflow-x-auto border border-[#355D46]">
                  {citationModalPub.bibtex}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(citationModalPub.bibtex);
                    setModalCopied(true);
                    setTimeout(() => setModalCopied(false), 2000);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#E7E3D3] hover:underline"
                >
                  {modalCopied ? (
                    <span className="text-emerald-400 font-semibold">✓ Copied BibTeX to clipboard!</span>
                  ) : (
                    <span>Copy BibTeX entry</span>
                  )}
                </button>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#BCB6A4] uppercase tracking-wider block mb-1">
                  APA Format
                </span>
                <p className="p-3 bg-[#162B1F] rounded-lg text-xs font-sans text-[#E7E3D3] border border-[#355D46]">
                  {getApaCitation(citationModalPub)}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#BCB6A4] uppercase tracking-wider block mb-1">
                  Harvard Format
                </span>
                <p className="p-3 bg-[#162B1F] rounded-lg text-xs font-sans text-[#E7E3D3] border border-[#355D46]">
                  {getHarvardCitation(citationModalPub)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
