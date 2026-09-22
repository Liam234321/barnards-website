import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/shared/ProjectCard';
import allProjects from '@/data/projects.json';


export default function Portfolio() {
  const sorted = [...allProjects].filter(p => !p.hidden).sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0));

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-24 md:py-32 px-6 md:px-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl text-stone-900"
        >
          Portfolio
        </motion.h1>
      </section>

      {/* Grid */}
      <div className="px-6 md:px-12 pb-32">
        <div className="max-w-7xl mx-auto">

          {sorted.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-stone-400 font-light">No projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {sorted.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
