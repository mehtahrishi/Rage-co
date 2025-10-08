'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BrandText } from './brand-text';

const containerVariants = {
  initial: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
};

const barContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 2.5,
    },
  },
};

const fragmentVariants = {
  initial: { opacity: 1, scale: 1, x: 0, y: 0 },
  animate: {
    opacity: 0,
    scale: 0.5,
    x: [0, () => Math.random() * 400 - 200],
    y: [0, () => Math.random() * 400 - 200],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function CustomLoader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const horizontalFragments = Array.from({ length: 10 });
  const verticalFragments = Array.from({ length: 5 });

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="relative flex items-center justify-center">
        {/* Rage SVG */}
        <motion.div
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.9, 1] }}
        >
          <BrandText />
        </motion.div>

        {/* Horizontal Loader Bar */}
        <motion.div
          className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-screen h-2"
          initial={{ scaleX: 0, transformOrigin: 'center' }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: 'linear' }}
          onAnimationComplete={() => {
            setTimeout(onLoadingComplete, 600);
          }}
        >
          <AnimatePresence>
            <motion.div
              className="w-full h-full flex"
              variants={barContainerVariants}
              initial="initial"
              animate="animate"
              exit="initial"
            >
              {horizontalFragments.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[10%] h-full bg-primary"
                  variants={fragmentVariants}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Vertical Loader Bar */}
        <motion.div
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-2 h-screen"
          initial={{ scaleY: 0, transformOrigin: 'center' }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, ease: 'linear' }}
        >
          <AnimatePresence>
            <motion.div
              className="w-full h-full flex flex-col"
              variants={barContainerVariants}
              initial="initial"
              animate="animate"
              exit="initial"
            >
              {verticalFragments.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-full h-[20%] bg-primary"
                  variants={fragmentVariants}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}