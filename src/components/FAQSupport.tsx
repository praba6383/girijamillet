import React, { useState } from 'react';
import { FAQs, GIRIJA_CONTACT } from '../data';
import { ChevronDown, ChevronUp, HelpCircle, MessageSquareShare, MessageCircle, Send, Users, ShieldAlert } from 'lucide-react';

export default function FAQSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [customQuery, setCustomQuery] = useState('');

  // Settle pre-defined helper support triggers
  const customTriggers = [
    {
      title: 'Bulk & Corporate Orders',
      pillText: 'Bulk Rates',
      query: 'Hi Girija Millets, I am interested in placing a bulk order for millet packages / health malts for a family event or retail store. Can you share custom wholesale price quotes?'
    },
    {
      title: 'Pediatric & Baby Diet Guide',
      pillText: 'Infant Feeding',
      query: 'Hi Girija Millets, I would like to ask which products are most appropriate for children under 3 years, and how to schedule Ragi Malt feeds safely.'
    },
    {
      title: 'Courier & Outstation Shipping',
      pillText: 'Shipping Status',
      query: 'Hi Girija Millets, I want to check if you ship to my location and what are the standard parcel shipping rates.'
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleSupportSend = (queryText: string) => {
    if (!queryText.trim()) return;
    const encoded = encodeURIComponent(queryText);
    window.open(`https://wa.me/91${GIRIJA_CONTACT}?text=${encoded}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="faq-support-section">
      
      {/* Accordion FAQ block */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 bg-brand-green-50 text-brand-green-700 font-display text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Common Answers
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Queries
          </h2>
          <p className="text-gray-400 text-xs font-sans">
            Have general questions about ordering, logistics, or grain health? We have curated explicit answers below.
          </p>
        </div>

        <div className="space-y-3">
          {FAQs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif text-sm sm:text-base font-bold text-gray-800 hover:text-brand-green-700 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-brand-green-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-brand-green-600 shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-left text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-50 animate-fadeIn bg-brand-green-50/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Integrated Live Support card */}
      <div className="lg:col-span-5 bg-white border border-gray-150/45 rounded-3xl p-6 sm:p-8 shadow-3xs text-left space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-green-700">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <MessageSquareShare className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
            <span className="font-display text-xs font-bold uppercase tracking-wider">
              WhatsApp Integration
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            Direct Customer Support
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            Connect immediately with our certified formulation desk. Choose one of our quick-triggers or draft your query below to launch inside your WhatsApp app.
          </p>
        </div>

        {/* Quick Question Triggers */}
        <div className="space-y-3">
          <span className="font-display text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            Tap To Ask Instantly:
          </span>
          <div className="flex flex-col gap-2">
            {customTriggers.map((trig, idx) => (
              <button
                key={idx}
                onClick={() => handleSupportSend(trig.query)}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-green-50/40 hover:bg-brand-green-50 border border-brand-green-150 hover:border-brand-green-200 text-left transition-colors cursor-pointer text-xs"
              >
                <div className="bg-brand-green-600 text-white font-display text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase shrink-0 mt-0.5">
                  {trig.pillText}
                </div>
                <div>
                  <span className="font-serif font-bold text-gray-800 hover:text-brand-green-700 block text-xs">
                    {trig.title}
                  </span>
                  <span className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 font-sans leading-none">
                    Pre-fills: "{trig.query}"
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom text box */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <span className="font-display text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            Or Draft Custom Query:
          </span>
          <div className="relative">
            <textarea
              rows={3}
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="E.g., Can you provide cooking instructions for child ragi malt porridge?"
              className="w-full text-xs sm:text-xs font-sans px-3.5 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-green-600 focus:outline-hidden text-gray-800 resize-none pr-12 focus:shadow-xs"
            />
            <button
              onClick={() => {
                handleSupportSend(customQuery);
                setCustomQuery('');
              }}
              disabled={!customQuery.trim()}
              className="absolute right-2.5 bottom-3 p-2 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-lg transition-all active:scale-90 disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer"
              title="Launch WhatsApp chat"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
          <Users className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-emerald-800 leading-relaxed font-semibold">
            Direct Line: +91 6383992062. Available 9:00 AM to 8:00 PM (Monday - Saturday). Speak in Tamil (தமிழ்) or English!
          </p>
        </div>

      </div>

    </div>
  );
}
