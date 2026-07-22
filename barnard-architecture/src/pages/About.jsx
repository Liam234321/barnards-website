import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useSiteContent } from '@/components/shared/useSiteContent';

export default function About() {
  const navigate = useNavigate();
  const content = useSiteContent();
  const { _isLoading } = content;
  const about = content['about'] || {};

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(createPageUrl(page));
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl text-stone-900 italic max-w-3xl leading-snug">
            
            {about.heading || 'Design with intention, build with purpose.'}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[3/4] bg-stone-100 overflow-hidden">
            
            {!_isLoading && about.image_url && (
              <img
                src={about.image_url}
                alt="Architect portrait"
                className="w-full h-full object-cover" />
            )}
            
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center">
            
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 italic mb-2">
              {about.subheading || 'Andrew Barnard'}
            </h2>
            <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-8">Nominated Architect</p>
            <div className="space-y-6 text-stone-600 font-light leading-loose">
              <p>{about.body || 'With over a decade of experience shaping spaces across residential, commercial, and cultural sectors, Barnard Architecture approaches each project as a unique dialogue between form and function.'}</p>
              <p>{about.body2 || 'Founded on the belief that great architecture should feel effortless — that it should serve the people who inhabit it while respecting the landscape it occupies — the practice is dedicated to creating environments that endure.'}</p>
              <p>{about.body3 || 'Every detail matters. From the way natural light enters a room to the materials that will age gracefully over decades, each decision is made with care and conviction. The result is architecture that doesn\'t shout, but quietly commands attention.'}</p>
            </div>

            {/* Qualifications */}
            <div className="mt-10 p-5 bg-stone-50 border border-stone-200">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">Registrations</p>
              <ul className="space-y-1 text-stone-400 text-sm font-light">
                <li>NSW Architects Registration Board 8422</li>
                <li>VIC Architects Registration AMR VIC00304</li>
                <li>TAS mutual architectural recognition 8422</li>
              </ul>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-stone-200 pt-10">
              <div>
                <p className="font-serif text-3xl text-stone-900 italic">{about.stat1_value || '10+'}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mt-2">{about.stat1_label || 'Years'}</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-stone-900 italic">{about.stat2_value || '50+'}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mt-2">{about.stat2_label || 'Projects'}</p>
                <a
                  href="https://www.linkedin.com/in/andrewbarnard2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-stone-400 hover:text-stone-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-xs font-light">LinkedIn</span>
                </a>
              </div>
              <div>
                <p className="font-serif text-3xl text-stone-900 italic">{about.stat3_value || '3'}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mt-2">{about.stat3_label || 'Awards'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-950 text-white py-32 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-10">Approach</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
            { text: 'I personally enjoy thinking and talking with clients and friends about how and why buildings are the way they are, how they age and renew and how we can design them to improve the personal experience of using them.' },
            { text: 'Good Architecture is a skillful balance of aesthetics, budgets, material, and colour, considered right down into the detail. Architecture is experienced at a human level.' },
            { text: 'The focus is on creating spaces that are intuitive and feel comfortable, where light and air raise awareness, movement is easy and utility meets peoples needs.' },
            { text: 'The results are buildings and landscapes that improve your daily life so it feels effortless to live, work and relax in.' }].
            map((val, i) =>
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}>
              
                <p className="text-stone-400 font-light leading-relaxed text-lg">{val.text}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 md:px-12 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 italic mb-10">
          Have a project in mind?
        </h2>
        <button
          onClick={() => handleNav('Contact')}
          className="inline-block border border-stone-900 text-stone-900 px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-stone-900 hover:text-white transition-all duration-500">
          
          Start a Conversation
        </button>
      </section>
    </div>);

}