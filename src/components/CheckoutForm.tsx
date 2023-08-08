'use client'
import { CardElement, useStripe, useElements, AddressElement } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CheckoutForm () {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const [Button, setButton] = useState<string>('Buy')
  const [error, setError] = useState<string| null>(null)
  const products: any[] = [{ price: 20 }, { price: 10 }, { price: 20 }]

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const address = await elements?.getElement(AddressElement)?.getValue() as any
    console.log(address)

    if (address.complete) {
      setButton('Loading...')
      const clientSecret = await fetch('http://localhost:3000/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      }).then(res => res.json())

      const { error, paymentIntent }: any = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement)!,
          billing_details: await elements?.getElement(AddressElement)?.getValue().then(res => res.value) as any
        }
      })

      if (!error) {
        setError(null)
        console.log(paymentIntent)
        setButton('Success!')
        router.push('/success')
      } else {
        setButton('Try again')
        setError(error.message)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4 w-[450px] bg-gray-800 p-6 rounded-md'
    >
      <AddressElement
        className='bg-gray-900 p-4 rounded-md'
        options={{
          mode: 'shipping',
          allowedCountries: ['CO'],
          autocomplete: {
            mode: 'automatic'
          },
          fields: {
            phone: 'always'
          },
          validation: {
            phone: {
              required: 'always'
            }
          },
          defaultValues: {
            name: 'Juan',
            address: {
              country: 'CO',
              city: 'Bogotá'
            }
          }
        }}
      />
      <CardElement
        className='bg-gray-900 p-4 rounded-md'
        options={{
          hidePostalCode: true,
          iconStyle: 'solid',
          style: {
            base: {
              fontSize: '16px',
              color: 'white'
            }
          }
        }}
      />
      <button
        disabled={Button === 'Loading...'}
        className='bg-gray-900 hover:bg-gray-700 transition-all p-2 rounded-md text-2xl'
      >
        {Button}
      </button>
      <p>{error}</p>
    </form>
  )
}
