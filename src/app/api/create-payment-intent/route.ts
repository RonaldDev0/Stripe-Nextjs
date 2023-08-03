import { NextRequest, NextResponse } from 'next/server'
import { Stripe } from 'stripe'

function calculateOrderAmount (items: any[]) {
  return items.reduce((acc: any, product: any) => acc + product.price * 100, 0)
}

export async function POST (req: NextRequest) {
  const { products } = await req.json()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })

  const paimentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(products),
    currency: 'USD',
    automatic_payment_methods: { enabled: true }
  })

  return NextResponse.json(paimentIntent.client_secret)
}
