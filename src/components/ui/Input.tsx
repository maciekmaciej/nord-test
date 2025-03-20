import { FC, InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input: FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      type='text'
      className={cn(
        'h-9 rounded-md border border-neutral-200 px-3 py-2 text-base sm:text-sm placeholder:text-neutral-400 shadow shadow-neutral-100 outline-sky-500 focus:outline-2',
        className
      )}
      {...props}
    />
  )
}
