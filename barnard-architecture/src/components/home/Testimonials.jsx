import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const FALLBACK = [
  {
    quote: "Working with Barnard was transformative. They understood our vision immediately and delivered something far beyond what we imagined — a home that genuinely changes how we live.",
    author: "James & Sarah M.",
    project: "The Glass Pavilion",
  },
  {
    quote: "The attention to detail is extraordinary. Every corner of our office was considered, not just for aesthetics, but for how people would actually use and feel within the space.",
    author: "Claire T.",
    project: "Warehouse 12",
  },
  {
    quote: "Barnard has a rare ability to listen deeply and translate what you feel — but can't quite articulate — into architecture. The result is a house that feels completely and quietly right.",
    author: "Robert K.",
    project: "Stone House",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const { data: dbTestimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.list('sort_order', 100),
  });

  // Only show testimonials not assigned to a specific project
  const homepageTestimonials = dbTestimonials.filter(t => !t.project);
  const TESTIMONIALS = homepageTestimonials.length > 0 ? homepageTestimonials : (dbTestimonials.length > 0 ? dbTestimonials : FALLBACK);

  const t = TESTIMONIALS[index % TESTIMONIALS.length];

  // Auto-advance every 7 seconds
  useEffect(() => {
    if (TESTIMONIALS.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex(i => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [TESTIMONIALS.length]);

  return (
    <section className="py-32 px-6 md:px-12 bg-stone-950">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-stone-600 mb-16 text-center">
          Client Words
        </p>

        <div className="relative min-h-[220px] flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center w-full"
            >
              {/* Quote mark */}
              <span className="font-serif text-6xl text-stone-700 leading-none select-none">"</span>
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-white italic leading-relaxed mt-2 mb-8 max-w-3xl mx-auto">
                {t.quote}
              </p>
              <p className="text-stone-400 text-sm font-light tracking-wider">{t.author}</p>
              <p className="text-stone-600 text-xs tracking-[0.2em] uppercase mt-1">{t.project}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={() => { setDirection(-1); setIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); }}
            className="text-stone-600 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-6' : 'bg-stone-700'}`}
              />
            ))}
          </div>
          <button
            onClick={() => { setDirection(1); setIndex(i => (i + 1) % TESTIMONIALS.length); }}
            className="text-stone-600 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}