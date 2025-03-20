import { ServersTable } from '../modules/Servers/ServersTable'

export const DashboardPage = () => {
  return (
    <section className='flex flex-col gap-5 mx-auto max-w-screen-lg'>
      <header>
        <h2 className='text-2xl font-bold text-neutral-700'>Servers</h2>
        <p className='text-neutral-500 text-sm'>
          Here you can see all the servers you have access to.
        </p>
      </header>

      <ServersTable />
    </section>
  )
}
