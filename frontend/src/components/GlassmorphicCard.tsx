
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div
      className={cn(
        'glass-panel transition-all duration-300 hover-lift animate-spring-up',
        'backdrop-blur-xl',
        'dark:bg-white/8 dark:border-white/18',
        'light:bg-black/5 light:border-black/20',
        'hover:bg-white/15 dark:hover:bg-white/12',
        'shadow-lg hover:shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
};
