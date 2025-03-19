import { ButtonHTMLAttributes, FC } from 'react'
import { cn } from '../../lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button: FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        'bg-neutral-900 flex gap-2 text-sm items-center justify-center shadow-sm shadow-neutral-200 text-center text-white font-medium px-5 h-9 rounded-md cursor-pointer transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed enabled:hover:bg-neutral-700 enabled:hover:shadow-md enabled:hover:shadow-neutral-200 enabled:active:scale-95 enabled:active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
