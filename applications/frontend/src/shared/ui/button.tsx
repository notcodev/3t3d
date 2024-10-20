import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/shadcn/cn'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

const buttonVariants = cva(
  'pixel-border-clickable active:enabled:pixel-border-clickable__active inline-flex items-center justify-center gap-2 whitespace-nowrap text-xl font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          '[--basic:theme("colors.primary.filled.DEFAULT")] [--highlight:theme("colors.primary.light.DEFAULT")] [--shadow:theme("colors.primary.dark.DEFAULT")] [--border-color:theme("colors.black")] hover:enabled:[--basic:theme("colors.primary.filled.hover")] hover:enabled:[--highlight:theme("colors.primary.light.hover")] hover:enabled:[--shadow:theme("colors.primary.dark.hover")] bg-primary-filled text-white hover:enabled:bg-primary-filled-hover enabled:[text-shadow:_0.0625rem_0.125rem_hsla(var(--ui-color-black)_/_0.5)]',
      },
      size: {
        default: 'h-8 px-4 py-2',
        sm: 'h-6 px-3',
        lg: 'h-10 px-5',
        icon: 'h-8 w-10',
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
