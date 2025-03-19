import { FC, HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
type InputErrorProps = HTMLAttributes<HTMLParagraphElement>

export const InputError: FC<InputErrorProps> = ({ className, ...props }) => {
  return (
    <p
      className={cn(
        'text-red-500 text-xs rounded-md px-3 py-2 font-medium bg-red-50',
        className
      )}
      {...props}
    />
  )
}
