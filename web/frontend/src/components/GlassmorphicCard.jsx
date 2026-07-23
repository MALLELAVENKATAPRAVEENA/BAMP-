import React from 'react';
import { motion } from 'framer-motion';

const GlassmorphicCard = ({ children, className = '', hoverEffect = true, onClick }) => {
  const hoverVariants = hoverEffect ? {
    hover: { 
      y: -4, 
      boxShadow: "0 12px 30px 0 rgba(14, 144, 233, 0.15)",
      borderColor: "rgba(14, 144, 233, 0.3)"
    }
  } : {};

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? "hover" : undefined}
      variants={hoverVariants}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`glass-card rounded-2xl p-6 border border-white/20 dark:border-white/5 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassmorphicCard;
