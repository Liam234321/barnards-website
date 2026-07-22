import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSlideshow({ images }) {
  const [index, setIndex] = useState(0);

  const imgs = images?.length > 0 ? images : [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
  ];

  useEffect(() => {
    if (imgs.length <= 1) return;
    const id = setInterval(() => setIndex(i => (i + 1) % imgs.length), 5000);
    return () => clearInterval(id);
  }, [imgs.length]);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="sync">
        <motion.img
          key={index}
          src={imgs[index]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}