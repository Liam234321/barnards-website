import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';

export default function ProjectDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => base44.entities.Project.filter({ id: projectId }),
    enabled: !!projectId,
    select: (data) => data?.[0],
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-project', projectId],
    queryFn: () => base44.entities.Testimonial.filter({ project: projectId }, 'sort_order', 50),
    enabled: !!projectId,
  });

  const [activeImage, setActiveImage] = useState(null);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-stone-400 font-light">Project not found.</p>
        <Link to={createPageUrl('Portfolio')} className="text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 transition-colors">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(project.cover_image ? [project.cover_image] : []),
    ...(project.gallery_images || []),
  ];

  return (
    <div className="pt-20">
      {/* Back link */}
      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <Link
          to={createPageUrl('Portfolio')}
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-stone-400 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Work
        </Link>
      </div>

      {/* Main: image left, text right */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Cover image */}
          {project.cover_image && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer"
              onClick={() => setActiveImage(project.cover_image)}
            >
              <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Text + metadata */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col gap-8 md:sticky md:top-28"
          >
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
                {project.title}
              </h1>
              {project.description && (
                <p className="mt-5 text-stone-500 font-light text-lg leading-relaxed">
                  {project.description}
                </p>
              )}
              {project.long_description && (
                <div className="mt-6 text-stone-600 font-light leading-loose whitespace-pre-line">
                  {project.long_description}
                </div>
              )}
            </div>

            <div className="space-y-5 border-t border-stone-200 pt-6">
              {project.category && (
                <div className="flex items-start gap-3">
                  <Tag className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-1">Type</p>
                    <p className="text-stone-700 font-light">{project.category}</p>
                  </div>
                </div>
              )}
              {project.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-1">Location</p>
                    <p className="text-stone-700 font-light">{project.location}</p>
                  </div>
                </div>
              )}
              {project.year && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-1">Year</p>
                    <p className="text-stone-700 font-light">{project.year}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery images below */}
      {(project.gallery_images || []).length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-8">Gallery</p>
          {/* Landscape images: 2 abreast */}
          {project.gallery_images.some((_, i) => (project.gallery_image_orientations?.[i] || 'landscape') !== 'portrait') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {project.gallery_images.map((img, i) => {
                const orient = project.gallery_image_orientations?.[i] || 'landscape';
                if (orient === 'portrait') return null;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="aspect-[4/3] overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                );
              })}
            </div>
          )}
          {/* Portrait images: 3 abreast */}
          {project.gallery_images.some((_, i) => (project.gallery_image_orientations?.[i]) === 'portrait') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.gallery_images.map((img, i) => {
                const orient = project.gallery_image_orientations?.[i];
                if (orient !== 'portrait') return null;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Project Testimonials */}
      {testimonials.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 md:px-12 pb-32">
          <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-10">Client Reviews</p>
          <div className="space-y-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-l-2 border-stone-200 pl-8"
              >
                <p className="text-stone-600 font-light leading-relaxed text-lg italic">"{t.quote}"</p>
                <p className="mt-4 text-xs tracking-[0.2em] uppercase text-stone-400">{t.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActiveImage(null)}
        >
          <img src={activeImage} alt="" className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}
    </div>
  );
}