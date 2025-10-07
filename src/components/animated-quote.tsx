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

const starVariants = {
    initial: { opacity: 0 },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      transition: {
        delay: i * 0.5,
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
      },
    }),
  };
  
const Star = ({ x, y, custom }: { x: number, y: number, custom: number }) => (
<motion.path
    d="M50,0 L61.8,38.2 L100,38.2 L69.1,61.8 L79.4,100 L50,76.4 L20.6,100 L30.9,61.8 L0,38.2 L38.2,38.2 Z"
    transform={`translate(${x}, ${y}) scale(0.05)`}
    className="text-primary fill-current"
    variants={starVariants}
    initial="initial"
    animate="animate"
    custom={custom}
/>
);

export function AnimatedQuote() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="container mx-auto px-4 py-8 text-center">
      <svg
        viewBox="0 0 1200 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
            `}
          </style>
        </defs>
        
        {isInView && (
            <>
                <Star x={100} y={10} custom={1} />
                <Star x={1100} y={60} custom={2} />
                <Star x={300} y={80} custom={3} />
                 <Star x={900} y={5} custom={4} />
            </>
        )}

        <motion.text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          className="fill-current text-foreground"
          style={{ fontFamily: "'UnifrakturMaguntia', cursive", fontSize: '32px' }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {words.map((word, index) => (
            <motion.tspan
              key={index}
              variants={wordVariants}
              className={cn(
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
