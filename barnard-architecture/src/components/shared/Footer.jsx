import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

// LinkedIn logo SVG in grayscale
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Footer() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      setIsAdmin(user?.role === 'admin');
    }).catch(() => {});
  }, []);

  const { data: records = [] } = useQuery({
    queryKey: ['site-content'],
    queryFn: () => base44.entities.SiteContent.list(),
  });

  const footerContent = records.find(r => r.key === 'footer') || {};

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(createPageUrl(page));
  };

  return (
    <footer className="bg-stone-950 text-stone-400 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
          <div>
            <p className="text-white tracking-[0.25em] text-sm font-light uppercase mb-4">Barnard Architecture</p>
            <div className="flex flex-col gap-3">
              {[{ label: 'Portfolio', page: 'Portfolio' }, { label: 'About', page: 'About' }, { label: 'Contact', page: 'Contact' }].map(link => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className="text-sm font-light hover:text-white transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-stone-500 mb-4">Contact</p>
            <p className="text-sm font-light leading-relaxed">
              {footerContent.heading || 'andrew@barnards.net.au'}
            </p>
            <div className="mt-6">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-500 mb-3">Registrations</p>
              <ul className="space-y-1 text-sm font-light leading-relaxed">
                <li>NSW ARB 8422</li>
                <li>VIC AMR VIC00304</li>
                <li>TAS 8422</li>
              </ul>
              <a
                href="https://www.linkedin.com/in/andrewbarnard2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-stone-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
                <span className="text-sm font-light">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-16 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs font-light text-stone-600">
            {footerContent.stat1_value || `Barnard Architecture ${new Date().getFullYear()}`}
          </p>
          {isAdmin && (
            <button
              onClick={() => handleNav('Admin')}
              className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-stone-600 hover:text-white transition-colors border border-stone-800 hover:border-stone-500 px-4 py-2"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage Projects
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}