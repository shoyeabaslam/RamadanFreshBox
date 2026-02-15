import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId } = body

    if (!amount || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Amount and orderId are required' },
        { status: 400 }
      )
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZOR_API_KEY!,
      key_secret: process.env.NEXT_PUBLIC_RAZOR_API_SECRET!,
    })

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        order_id: orderId.toString(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.NEXT_PUBLIC_RAZOR_API_KEY,
      },
    })
  } catch (error) {
    console.error('Payment order creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
