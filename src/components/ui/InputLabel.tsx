import { FC, LabelHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type InputLabelProps = LabelHTMLAttributes<HTMLLabelElement>

export const InputLabel: FC<InputLabelProps> = ({ className, ...props }) => {
  return (
    <label
      className={cn(
        'text-xs font-medium text-neutral-500 leading-none',
        className
      )}
      {...props}
    />
  )
}
