import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, MessageSquare, MapPin, Copy, Check, ExternalLink } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const mailSubject = '[TEIC INTEREST] Go raibh míle maith agat!';
  const mailBody = `Name: ${formData.fullName}
Email: ${formData.email}${formData.organization ? `\nOrganisation: ${formData.organization}` : ''}

Why would you like to get involved with the TEIC group?
${formData.message}`;

  const mailtoLink = `mailto:josh.mcgiff@ul.ie?subject=${encodeURIComponent(
    mailSubject
  )}&body=${encodeURIComponent(mailBody)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save record to local storage for persistence
    try {
      const stored = localStorage.getItem('teic_enquiries') || '[]';
      const list = JSON.parse(stored);
      list.push({ ...formData, timestamp: new Date().toISOString() });
      localStorage.setItem('teic_enquiries', JSON.stringify(list));
    } catch (err) {
      console.warn('Could not store to local storage', err);
    }

    // Trigger native mailto client
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        window.location.href = mailtoLink;
      } catch (err) {
        console.warn('Mailto handler not triggered automatically', err);
      }
    }, 300);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(`To: josh.mcgiff@ul.ie\nSubject: ${mailSubject}\n\n${mailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-16 lg:py-24 border-b border-[#294B37] bg-[#1C3728]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Direct Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest font-sans font-semibold text-[#BCB6A4] mb-2">
                Bí Linn · Get Involved
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F5F1E4]">
                Join Our Efforts
              </h2>
              <p className="mt-4 text-base text-[#C8C2AF] leading-relaxed">
                Whether you are advancing natural language processing for Irish, looking to connect across universities in the Irish tech ecosystem, or contributing code and data to shared open resources, we welcome your participation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#224231] border border-[#355D46] space-y-3 text-xs text-[#C8C2AF]">
              <div className="font-semibold text-[#F5F1E4] text-sm">
                Direct Coordinating Contacts:
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E7E3D3] shrink-0" />
                <span>Enquiries: <a href="mailto:josh.mcgiff@ul.ie" className="text-[#E7E3D3] hover:underline font-semibold">josh.mcgiff@ul.ie</a></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E7E3D3] shrink-0" />
                <span>Research Base: CSIS Building, University of Limerick (UL)</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#E7E3D3] shrink-0" />
                <span>Weekly Meetings: Every Thursday at 11:00 AM (CSIS & Teams)</span>
              </div>
              <div className="pt-2 text-[11px] text-[#918B7A]">
                All sessions are open and free of charge.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl bg-[#224231] border border-[#355D46] shadow-sm">
              {isSubmitted ? (
                <div className="py-8 text-center space-y-5">
                  <CheckCircle2 className="w-12 h-12 text-[#E7E3D3] mx-auto" />
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-[#F5F1E4]">
                      Go raibh míle maith agat!
                    </h3>
                    <p className="text-sm text-[#C8C2AF] max-w-md mx-auto mt-2 leading-relaxed">
                      Your message has been formatted to send directly to <strong className="text-[#F5F1E4]">josh.mcgiff@ul.ie</strong>. If your email application did not launch automatically, you can open it below or copy the message.
                    </p>
                  </div>

                  {/* Summary preview of submission */}
                  <div className="p-4 bg-[#162B1F] rounded-lg border border-[#355D46] text-left text-xs space-y-2 text-[#C8C2AF] max-w-lg mx-auto">
                    <div>
                      <span className="text-[#918B7A] font-semibold">To: </span>
                      <span className="text-[#E7E3D3] font-mono">josh.mcgiff@ul.ie</span>
                    </div>
                    <div>
                      <span className="text-[#918B7A] font-semibold">From: </span>
                      <span className="text-[#F5F1E4]">{formData.fullName} ({formData.email})</span>
                      {formData.organization && <span className="text-[#BCB6A4]"> · {formData.organization}</span>}
                    </div>
                    <div className="pt-2 border-t border-[#294B37]">
                      <span className="text-[#918B7A] font-semibold block mb-1">Why you would like to get involved:</span>
                      <p className="text-[#E7E3D3] whitespace-pre-wrap">{formData.message}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={mailtoLink}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] rounded-lg hover:bg-[#F5F1E4] transition-colors shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#162B1F]" />
                      <span>Open in Email App</span>
                      <ExternalLink className="w-3 h-3 text-[#162B1F]" />
                    </a>

                    <button
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#E7E3D3] bg-[#162B1F] hover:bg-[#294F3C] border border-[#355D46] rounded-lg transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-semibold">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#BCB6A4]" />
                          <span>Copy Message Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          organization: '',
                          message: '',
                        });
                      }}
                      className="text-xs font-medium text-[#BCB6A4] hover:text-[#F5F1E4] hover:underline"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#BCB6A4] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Máire Ní Shé"
                        className="w-full px-3.5 py-2 text-sm bg-[#162B1F] border border-[#355D46] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E7E3D3] text-[#F5F1E4] placeholder-[#918B7A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#BCB6A4] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. maire@example.ie"
                        className="w-full px-3.5 py-2 text-sm bg-[#162B1F] border border-[#355D46] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E7E3D3] text-[#F5F1E4] placeholder-[#918B7A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#BCB6A4] mb-1">
                      Organisation <span className="text-[#918B7A] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. University, research centre, community group, or company"
                      className="w-full px-3.5 py-2 text-sm bg-[#162B1F] border border-[#355D46] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E7E3D3] text-[#F5F1E4] placeholder-[#918B7A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#BCB6A4] mb-1">
                      Why would you like to get involved with the TEIC group? *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what draws you to TEIC, what you are working on, or how you would like to collaborate..."
                      className="w-full px-3.5 py-2 text-sm bg-[#162B1F] border border-[#355D46] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E7E3D3] text-[#F5F1E4] placeholder-[#918B7A]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-[#918B7A]">
                      Enquiries are sent directly to <strong className="text-[#BCB6A4]">josh.mcgiff@ul.ie</strong>.
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Preparing...' : 'Send Enquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
