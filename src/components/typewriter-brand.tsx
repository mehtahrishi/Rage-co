'use client';

import { motion } from 'framer-motion';
import { UnifrakturMaguntia } from 'next/font/google';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const font = UnifrakturMaguntia({
    weight: '400',
    subsets: ['latin']
});

export function TypewriterBrand() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const text = "Liars";

    // Determine color: Dark text in light mode, White text in dark mode
    const textColor = mounted && resolvedTheme === 'light' ? 'text-black' : 'text-white';

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            display: 'inline-block', // Ensures letters sit correctly
        },
        hidden: {
            opacity: 0,
            display: 'none', // Hides completely for typewriter effect
        },
    };

    // Use a slightly different variant for smooth fade-in typewriter if display:none causes layout shifts
    const smoothChild = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            <motion.div
                className={`${font.className} ${textColor} text-6xl md:text-8xl tracking-wider`}
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
            >
                {text.split("").map((letter, index) => (
                    <motion.span variants={smoothChild} key={index}>
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
}
