import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#21262d] text-[#c9d1d9] border-[#30363d]',
        secondary: 'bg-[#21262d] text-[#8b949e] border-[#30363d]',
        success: 'bg-[#238636]/15 text-[#3fb950] border-[#238636]/40',
        destructive: 'bg-[#da3633]/15 text-[#f85149] border-[#da3633]/40',
        outline: 'text-[#c9d1d9] border-[#30363d]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
