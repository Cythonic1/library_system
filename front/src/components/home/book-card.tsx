

import { useState } from 'react';
import { motion } from 'motion/react';
import { ProgressiveBlur } from '../ui/progressive-blur';
import { Book } from '@/lib/types';
import { Badge } from '../ui/badge';

export function BookProgressiveBlurHover(
    {
        book
    }:{book:Book}
) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className='relative my-4 aspect-square  w-[350px] h-[300px] overflow-hidden rounded-[4px]'
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img
        src={book.url}
        alt={book.title}
        className='absolute inset-0  h-[300px]'
      />
      <ProgressiveBlur
        className='pointer-events-none absolute bottom-0 left-0 h-[75%] w-full'
        blurIntensity={0.5}
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      <motion.div
        className='absolute bottom-0 left-0'
        animate={isHover ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className='flex flex-col items-start gap-0 px-5 py-4'>
            <p className='text-base font-medium text-white'>{book.title} | {book.author}</p>
            <span className='text-base text-zinc-300'>{book.desc}</span>
            <Badge variant={"secondary"} className='my-2'>{book.genre}</Badge>
        </div>
      </motion.div>
    </div>
  );
}
