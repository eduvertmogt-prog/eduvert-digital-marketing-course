import type { ReactNode } from "react"

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "hero",
  className = "",
  target,
  rel,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
    >
      {children}
    </a>
  )
}

const buttonBase =
  "items-center justify-center rounded-eduvert-8 text-eduvert-button leading-eduvert-button font-eduvert-600 transition-colors"

const buttonVariants = {
  primary: "bg-eduvert-action-primary text-eduvert-surface-white hover:bg-eduvert-action-hover",
  secondary:
    "border border-eduvert-border-subtle bg-eduvert-surface-white text-eduvert-text-primary hover:bg-eduvert-tint-magenta",
}

const buttonSizes = {
  nav: "inline-flex h-11 w-[166px]",
  hero: "inline-flex h-12 min-w-0 flex-1 min-[1100px]:w-[174px] min-[1100px]:flex-none",
  course: "inline-flex h-12 min-w-0 flex-1 min-[1100px]:flex-none",
}

interface ButtonLinkProps {
  href: string
  children: ReactNode
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  className?: string
  target?: "_blank" | "_self"
  rel?: string
}
