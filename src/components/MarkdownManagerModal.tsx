import React, { useState, useEffect } from 'react';
import { SAMPLE_PUBLICATION_TEMPLATE, SAMPLE_MEETING_TEMPLATE } from '../data/contentStore';
import { parseFrontmatter, renderMarkdown } from '../utils/markdownParser';
import { X, Download, Copy, Check, Eye, Code, FileText, Calendar, Sparkles, HelpCircle } from 'lucide-react';

interface MarkdownManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomPub: (markdown: string) => void;
  onSaveCustomMeeting: (markdown: string) => void;
  initialType?: 'publication' | 'meeting';
}

export const MarkdownManagerModal: React.FC<MarkdownManagerModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomPub,
  onSaveCustomMeeting,
  initialType = 'publication',
}) => {
  const [entryType, setEntryType] = useState<'publication' | 'meeting'>(initialType);
  const [markdownContent, setMarkdownContent] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'guide'>('edit');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync initial template when type or modal opens
  useEffect(() => {
    if (isOpen) {
      if (entryType === 'publication') {
        setMarkdownContent(SAMPLE_PUBLICATION_TEMPLATE);
      } else {
        setMarkdownContent(SAMPLE_MEETING_TEMPLATE);
      }
      setStatusMessage(null);
    }
  }, [isOpen, entryType]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setStatusMessage('Markdown copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setStatusMessage(null);
    }, 3000);
  };

  const handleDownloadFile = () => {
    const { data } = parseFrontmatter(markdownContent);
    const slug = (data.slug || data.title || (entryType === 'publication' ? 'new-publication' : 'new-meeting'))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const datePrefix = data.date || new Date().toISOString().slice(0, 10);
    const filename = `${datePrefix}-${slug}.md`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMessage(`Downloaded ${filename}! Drop it in src/content/${entryType === 'publication' ? 'publications' : 'meetings'}/ in your GitHub repo.`);
  };

  const handlePreviewInSite = () => {
    if (entryType === 'publication') {
      onSaveCustomPub(markdownContent);
      onClose();
    } else {
      onSaveCustomMeeting(markdownContent);
      onClose();
    }
  };

  const { data: parsedData, content: parsedBody } = parseFrontmatter(markdownContent);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#1C3728] rounded-xl max-w-4xl w-full border border-[#355D46] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-[#294B37] flex items-center justify-between gap-4 bg-[#162B1F]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#F5F1E4]">
                Markdown Entry Studio & GitHub Maintenance
              </h3>
              <span className="text-[11px] font-mono text-[#162B1F] bg-[#E7E3D3] px-2 py-0.5 rounded font-semibold">
                Easy Maintenance
              </span>
            </div>
            <p className="text-xs text-[#BCB6A4] mt-0.5">
              Author a new publication or meeting in Markdown. Download or test directly on this site.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#BCB6A4] hover:text-[#F5F1E4] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector & Tab Strip */}
        <div className="px-4 sm:px-6 pt-3 pb-3 border-b border-[#294B37] flex flex-wrap items-center justify-between gap-3 bg-[#162B1F]/60">
          {/* Publication vs Meeting Switch */}
          <div className="flex items-center gap-1 p-1 bg-[#162B1F] rounded-lg border border-[#355D46]">
            <button
              onClick={() => setEntryType('publication')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                entryType === 'publication'
                  ? 'bg-[#E7E3D3] text-[#162B1F] shadow-sm font-semibold'
                  : 'text-[#C8C2AF] hover:text-[#F5F1E4]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-current" />
              <span>Publication Entry</span>
            </button>

            <button
              onClick={() => setEntryType('meeting')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                entryType === 'meeting'
                  ? 'bg-[#E7E3D3] text-[#162B1F] shadow-sm font-semibold'
                  : 'text-[#C8C2AF] hover:text-[#F5F1E4]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-current" />
              <span>Meeting / Agenda Entry</span>
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'edit'
                  ? 'bg-[#224231] text-[#F5F1E4] border border-[#355D46]'
                  : 'text-[#BCB6A4] hover:text-[#F5F1E4]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Markdown Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-[#224231] text-[#F5F1E4] border border-[#355D46]'
                  : 'text-[#BCB6A4] hover:text-[#F5F1E4]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'guide'
                  ? 'bg-[#224231] text-[#F5F1E4] border border-[#355D46]'
                  : 'text-[#BCB6A4] hover:text-[#F5F1E4]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>GitHub Maintenance Guide</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === 'edit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#BCB6A4]">
                <span>
                  Target folder: <code className="font-mono text-[#E7E3D3]">/src/content/{entryType === 'publication' ? 'publications' : 'meetings'}/*.md</code>
                </span>
                <button
                  onClick={() => {
                    setMarkdownContent(entryType === 'publication' ? SAMPLE_PUBLICATION_TEMPLATE : SAMPLE_MEETING_TEMPLATE);
                  }}
                  className="hover:underline text-[#E7E3D3]"
                >
                  Reset Template
                </button>
              </div>

              <textarea
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                rows={16}
                className="w-full p-4 font-mono text-xs sm:text-sm bg-[#162B1F] border border-[#355D46] rounded-lg text-[#F5F1E4] focus:outline-none focus:ring-2 focus:ring-[#E7E3D3] leading-relaxed resize-y"
                placeholder="---
title: ...
---
# Content here"
              />
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="p-6 bg-[#162B1F] rounded-xl border border-[#355D46] space-y-4">
              <div className="border-b border-[#294B37] pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#E7E3D3] block mb-1">
                  Preview: {entryType === 'publication' ? (parsedData.venue || 'Publication Preview') : (parsedData.time || 'Meeting Preview')}
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#F5F1E4]">
                  {parsedData.title || 'Untitled Entry'}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#BCB6A4] mt-2 font-sans">
                  <span>Date: {parsedData.date || 'Today'}</span>
                  {parsedData.authors && (
                    <>
                      <span>·</span>
                      <span>Authors: {Array.isArray(parsedData.authors) ? parsedData.authors.join(', ') : parsedData.authors}</span>
                    </>
                  )}
                  {parsedData.location && (
                    <>
                      <span>·</span>
                      <span>Location: {parsedData.location}</span>
                    </>
                  )}
                </div>
              </div>

              {parsedData.abstract && (
                <div className="text-sm text-[#E7E3D3] italic border-l-2 border-[#E7E3D3] pl-3 py-1">
                  {parsedData.abstract}
                </div>
              )}

              <div
                className="prose prose-invert max-w-none text-sm text-[#E7E3D3] leading-relaxed pt-2"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(parsedBody) }}
              />
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6 text-sm text-[#C8C2AF]">
              <div className="p-4 rounded-lg bg-[#224231] border border-[#355D46]">
                <h4 className="font-serif text-base font-semibold text-[#F5F1E4] mb-1">
                  How TEIC Makes Maintenance Effortless on GitHub
                </h4>
                <p className="text-xs text-[#C8C2AF] leading-relaxed">
                  You do not need to touch React code or databases to update publications or meetings. Every entry is a standard Markdown (.md) file with YAML frontmatter stored in the repository.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold w-6 h-6 rounded-full bg-[#E7E3D3] text-[#162B1F] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h5 className="font-semibold text-[#F5F1E4] text-sm">
                      Create or Download your Markdown file
                    </h5>
                    <p className="text-xs text-[#BCB6A4] mt-0.5">
                      Use the <strong>Markdown Editor</strong> tab above to fill in your paper title, authors, or meeting agenda. Click <strong>"Download .md File"</strong> or copy the text.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold w-6 h-6 rounded-full bg-[#E7E3D3] text-[#162B1F] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h5 className="font-semibold text-[#F5F1E4] text-sm">
                      Add to your GitHub Repository
                    </h5>
                    <p className="text-xs text-[#BCB6A4] mt-0.5">
                      In GitHub, open your repository and go to:
                      <br />
                      • For Publications: <code className="bg-[#162B1F] px-1 py-0.5 rounded text-[#E7E3D3] font-mono text-xs">src/content/publications/</code>
                      <br />
                      • For Meetings & Agendas: <code className="bg-[#162B1F] px-1 py-0.5 rounded text-[#E7E3D3] font-mono text-xs">src/content/meetings/</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold w-6 h-6 rounded-full bg-[#E7E3D3] text-[#162B1F] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h5 className="font-semibold text-[#F5F1E4] text-sm">
                      Commit & Automatic GitHub Pages Deployment
                    </h5>
                    <p className="text-xs text-[#BCB6A4] mt-0.5">
                      Commit your new file. With GitHub Pages, Vite compiles the new markdown into your static site automatically—no server maintenance required!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-[#224231] border border-[#355D46] text-xs text-[#E7E3D3]">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-6 border-t border-[#294B37] bg-[#162B1F] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#E7E3D3] bg-[#224231] border border-[#355D46] hover:bg-[#294F3C] rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#BCB6A4]" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#E7E3D3] bg-[#224231] border border-[#355D46] hover:bg-[#294F3C] rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-[#BCB6A4]" />
              <span>Download .md File</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#BCB6A4] hover:text-[#F5F1E4] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handlePreviewInSite}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-lg transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#162B1F]" />
              <span>Test Live in Current Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
