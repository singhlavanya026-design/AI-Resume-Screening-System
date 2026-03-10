import React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = ({ className, hover, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm',
        hover && 'transition-all hover:shadow-md hover:border-zinc-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
