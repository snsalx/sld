import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "flex items-center justify-center rounded-lg border-2 border-crust bg-base text-sapphire transition hover:scale-95 hover:border-sky",
  {
    variants: {
      variant: {
        blue: "text-blue hover:border-blue",
        sapphire: "text-sapphire hover:border-sapphire",
        sky: "text-sky hover:border-sky",
        teal: "text-teal hover:border-teal",
        green: "text-green hover:border-green",
        peach: "text-peach hover:border-peach",
        yellow: "text-yellow hover:border-yellow",
        red: "text-red hover:border-red",
      },
      size: {
        default: "h-16 p-4",
        fill: "h-16 w-full p-4",
        icon: "h-16 w-16 p-4",
      },
    },
    defaultVariants: {
      variant: "blue",
      size: "icon",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
