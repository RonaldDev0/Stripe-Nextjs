'use client'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

export function CheckoutForm () {
  const stripe = useStripe()
  const elements = useElements()

  const products: any[] = [{ price: 20 }, { price: 10 }, { price: 20 }]

  const handleSubmit = async (e: any) => {
    e.preventDefault()

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
      console.log({ paymentIntent })
    } else {
      console.log({ error })
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[450px] bg-gray-800 p-6 rounded-md'>
      <CardElement className='bg-gray-900 p-4 rounded-md' options={{ hidePostalCode: true, iconStyle: 'solid', style: { base: { fontSize: '16px', color: 'white' } } }} />
      <button className='bg-gray-900 hover:bg-gray-700 transition-all p-2 rounded-md text-2xl'>Pay</button>
    </form>
  )
}
