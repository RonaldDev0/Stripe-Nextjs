'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutForm } from '@/components'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!)

export default function Home () {
  return (
    <div className='h-screen flex justify-center items-center'>
      <Elements stripe={stripePromise} options={{ appearance: { theme: 'night' } }}>
        <CheckoutForm />
      </Elements>
    </div>
  )
}
