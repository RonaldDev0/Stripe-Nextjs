import Link from 'next/link'

export default function Success () {
  return (
    <main className='h-screen flex flex-col gap-5 items-center justify-center'>
      <h1 className='text-2xl'>Apa este es el inicio de la aplicacion</h1>
      <Link href='/' className='text-xl bg-gray-900 p-2 rounded-md hover:bg-gray-800 transition-all'>Hacer otra compra</Link>
    </main>
  )
}
