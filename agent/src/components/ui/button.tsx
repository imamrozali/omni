import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-[#238636] hover:bg-[#2ea043] text-white border border-[rgba(240,246,252,0.1)] shadow-xs',
        secondary: 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] shadow-xs',
        destructive: 'bg-[#da3633] hover:bg-[#b62324] text-white border border-[rgba(240,246,252,0.1)] shadow-xs',
        outline: 'border border-[#30363d] bg-transparent text-[#c9d1d9] hover:bg-[#21262d]',
        ghost: 'bg-transparent text-[#c9d1d9] hover:bg-[#21262d]',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs rounded-md',
        md: 'h-8 px-3 text-xs rounded-md',
        lg: 'h-10 px-4 text-sm rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-1.5 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
