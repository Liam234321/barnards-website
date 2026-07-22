import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function ProjectCard({ project, index = 0, orientation }) {
  const [loaded, setLoaded] = useState(false);
  const isPortrait = (orientation || project.cover_image_orientation) === 'portrait';
  const aspectClass = isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]';
  const hasRealBlurb = project.long_description && !project.long_description.startsWith('Lorem ipsum');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={createPageUrl(`ProjectDetail?id=${project.id}`)} className="group block">
        <div className={`relative overflow-hidden bg-stone-100 ${aspectClass} transition-transform duration-500 group-hover:scale-[1.02]`}>
          {project.cover_image && (
            <img
              src={project.cover_image}
              alt={project.title}
              onLoad={() => setLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          {!project.cover_image && (
            <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm tracking-widest uppercase">
              No Image
            </div>
          )}
        </div>
        <div className="mt-5">
          <h3 className="text-lg font-light text-stone-900 tracking-wide flex items-center gap-2">
            {project.title}
            {hasRealBlurb && <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-400 flex-shrink-0" title="Copy complete" />}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            {project.category && (
              <span className="text-xs tracking-[0.15em] uppercase text-stone-400 font-light">{project.category}</span>
            )}
            {project.year && (
              <>
                <span className="text-stone-300">·</span>
                <span className="text-xs tracking-[0.15em] uppercase text-stone-400 font-light">{project.year}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}