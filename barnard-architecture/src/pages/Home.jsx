import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProjectCard from '@/components/shared/ProjectCard';
import Testimonials from '@/components/home/Testimonials';
import { useSiteContent } from '@/components/shared/useSiteContent';

export default function Home() {
  const navigate = useNavigate();
  const content = useSiteContent();
  const { _isLoading: contentLoading } = content;

  const { data: projects = [] } = useQuery({
    queryKey: ['projects-featured'],
    queryFn: () => base44.entities.Project.filter({ featured: true }, '-sort_order', 6)
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects-all'],
    queryFn: () => base44.entities.Project.list('-sort_order', 50)
  });

  const visibleFeatured = projects.filter((p) => !p.hidden);
  const visibleAll = allProjects.filter((p) => !p.hidden);
  const displayProjects = visibleFeatured.length > 0 ? visibleFeatured : visibleAll.slice(0, 6);

  const hero = content['hero'] || {};
  const philosophy = content['philosophy'] || {};
  const cta = content['cta'] || {};

  // Collect hero slideshow images
  const heroImages = [hero.image_url, hero.image_url_2, hero.image_url_3].filter(Boolean);

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(createPageUrl(page));
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center bg-stone-950 overflow-hidden"
      style={!contentLoading && hero.image_url ? { backgroundImage: `url(${hero.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        
        {!contentLoading && hero.image_url && <div className="absolute inset-0 bg-black/40" />}
        <div className="relative z-10 text-center px-6">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-8 py-6 rounded-none">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-serif text-white font-bold leading-tight whitespace-nowrap text-5xl md:text-5xl lg:text-5xl">
              
              Barnard Studio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{ textAlign: 'justify', textAlignLast: 'justify' }}
              className="text-white tracking-[0.2em] uppercase mt-3 font-medium w-full text-lg px-1">
              
              Architecture & Design
            </motion.p>
          </div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2">
          
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/40" />
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6 md:px-16 bg-stone-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[
            philosophy.body || 'Space planning should be efficient, solutions simple, and every decision responding to the individual site and project.',
            philosophy.body2 || 'From feasibility to delivery, resolving the complexities of building with clarity and purpose, gives buildings that are both buildable and tailored to their reason.',
            philosophy.body3,
            philosophy.body4].
            filter(Boolean).map((sentence, i) =>
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="text-stone-300 font-light leading-relaxed text-lg">
              
                {sentence}
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {displayProjects.length > 0 &&
      <section className="py-24 px-6 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                
                <h2 className="font-serif text-3xl md:text-4xl text-stone-900">Work</h2>
              </div>
              <button
              onClick={() => handleNav('Portfolio')}
              className="text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-2">
              
                All Projects <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {displayProjects.map((project, i) =>
            <ProjectCard key={project.id} project={project} index={i} />
            )}
            </div>
            <div className="mt-16 flex justify-center">
              <button
              onClick={() => handleNav('Portfolio')}
              className="text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-2">
                All Projects <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            </div>
        </section>
      }

      <Testimonials />

      {/* CTA */}
      <section className="bg-stone-100 py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-4xl text-stone-900">
            
            {cta.heading || "Let's build something meaningful."}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10">
            
            <button
              onClick={() => handleNav('Contact')}
              className="inline-block border border-stone-900 text-stone-900 px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-stone-900 hover:text-white transition-all duration-500">
              
              {cta.subheading || 'Get in Touch'}
            </button>
          </motion.div>
        </div>
      </section>
    </div>);

}