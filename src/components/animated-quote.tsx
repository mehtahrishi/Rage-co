'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

const quoteText = '“Rage, Rage against the Dying of the Light”';
const words = quoteText.split(' ');

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

export function AnimatedQuote() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="container mx-auto px-4 py-16 text-center">
      <svg
        viewBox="0 0 1200 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}
      >
        <defs>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
            `}
          </style>
        </defs>
        <motion.text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          className="fill-current text-foreground"
          style={{ fontSize: '32px' }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {words.map((word, index) => (
            <motion.tspan
              key={index}
              variants={wordVariants}
              className={cn(
                // Add a space between words, except for the first one
                index > 0 && 'ml-4'
              )}
            >
              {word}{' '}
            </motion.tspan>
          ))}
        </motion.text>
      </svg>
    </div>
  );
}
