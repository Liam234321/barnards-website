import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation({ currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page) => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(createPageUrl(page));
  };

  const links = [
    { label: 'Portfolio', page: 'Portfolio' },
    { label: 'About', page: 'About' },
    { label: 'Contact', page: 'Contact' },
  ];

  const isHome = currentPage === 'Home';
  const navBg = scrolled || !isHome ? 'bg-white/95 backdrop-blur-md border-b border-stone-200' : 'bg-transparent';
  const textColor = scrolled || !isHome ? 'text-stone-900' : 'text-white';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <button
            onClick={() => handleNav('Home')}
            className={`tracking-[0.25em] text-sm font-light uppercase transition-colors duration-300 ${textColor}`}
          >
            Barnard Architecture
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {links.map(link => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 hover:opacity-60 border-b-2 border-transparent hover:border-current pb-0.5 ${textColor} ${currentPage === link.page ? 'opacity-100' : 'opacity-70'}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className={`md:hidden transition-colors duration-300 ${textColor}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-10"
          >
            {links.map(link => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className="text-lg tracking-[0.3em] uppercase font-light text-stone-900 hover:text-stone-500 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}