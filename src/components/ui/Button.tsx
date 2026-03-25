import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]': variant === 'primary',
            'bg-slate-800 text-slate-100 hover:bg-slate-700': variant === 'secondary',
            'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500/10': variant === 'outline',
            'h-9 px-4 text-sm': size === 'sm',
            'h-12 px-8 text-lg': size === 'md',
            'h-16 px-12 text-2xl': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
