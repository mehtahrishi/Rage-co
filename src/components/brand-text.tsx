import { cn } from '@/lib/utils';
import { Playfair_Display } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400'],
});

export function BrandText({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      className={cn('h-10 w-auto', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
          `}
        </style>
      </defs>
      <text
        x="50%"
        y="50%"
        dy=".35em"
        textAnchor="middle"
        style={{
          fontFamily: "'UnifrakturMaguntia', cursive",
          fontSize: '80px',
          fill: 'currentColor',
        }}
      >
        Rage
      </text>
    </svg>
  );
}
