import { FC } from 'react'
import { PropsWithChildren } from 'react'
import { Header } from './Header'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='min-h-dvh flex flex-col gap-10 pb-10 bg-neutral-50'>
      <Header />
      <main className='container'>{children}</main>
    </div>
  )
}
