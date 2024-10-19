import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/shadcn/cn'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

const buttonVariants = cva(
  'pixel-border-clickable active:pixel-border-clickable__active inline-flex items-center justify-center gap-2 whitespace-nowrap text-xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-disabled disabled:[--basic:theme("colors.disabled.DEFAULT")] disabled:[--highlight:theme("colors.disabled.highlight")] disabled:[--shadow:theme("colors.disabled.shadow")] disabled:[--border-color:theme("colors.border.disabled")] disabled:text-disabled-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          '[--basic:theme("colors.primary.DEFAULT")] [--highlight:theme("colors.primary.highlight")] [--shadow:theme("colors.primary.shadow")] [--border-color:theme("colors.border.DEFAULT")] bg-primary text-primary-foreground',
        destructive:
          '[--basic:theme("colors.destructive.DEFAULT")] [--highlight:theme("colors.destructive.highlight")] [--shadow:theme("colors.destructive.shadow")] [--border-color:theme("colors.border.DEFAULT")] bg-destructive text-destructive-foreground',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
