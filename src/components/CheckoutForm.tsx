'use client'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CheckoutForm () {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const [state, setState] = useState<string>('Buy')
  const products: any[] = [{ price: 20 }, { price: 10 }, { price: 20 }]

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setState('Loading...')

    const clientSecret = await fetch('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products })
    }).then(res => res.json())

    const { error, paymentIntent }: any = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements?.getElement(CardElement)!,
        billing_details: {
          name: 'elon musk'
        }
      }
    })

    if (!error) {
      setState('Success!')
      router.push('/success')
      console.log({ paymentIntent })
    } else {
      setState('Error')
      console.log({ error })
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[450px] bg-gray-800 p-6 rounded-md'>
      <CardElement className='bg-gray-900 p-4 rounded-md' options={{ hidePostalCode: true, iconStyle: 'solid', style: { base: { fontSize: '16px', color: 'white' } } }} />
      <button className='bg-gray-900 hover:bg-gray-700 transition-all p-2 rounded-md text-2xl'>{state}</button>
    </form>
  )
}
