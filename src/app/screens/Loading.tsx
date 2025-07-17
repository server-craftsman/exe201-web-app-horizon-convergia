import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loading: React.FC = () => {
  return (
    <AnimatePresence>
      <motion.div
        style={{
          zIndex: 2147483647,
          position: 'fixed',
        }}
        className="fixed inset-0 h-screen w-full flex justify-center items-center backdrop-blur-md bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Animated Amber Circle (motion) */}
          <motion.span
            className="block w-24 h-24 border-8 border-amber-400 border-t-transparent rounded-full"
            style={{ borderTopColor: 'transparent' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          />
          {/* Pulsing Glow (motion) */}
          <motion.span
            className="absolute w-24 h-24 rounded-full bg-amber-400/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          />
          {/* Center Dot (motion) */}
          <motion.span
            className="absolute w-6 h-6 rounded-full bg-amber-400 shadow-lg"
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loading;
