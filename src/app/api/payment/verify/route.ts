import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { getClient } from '@/database/db/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      amount,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment details' },
        { status: 400 }
      )
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.NEXT_PUBLIC_RAZOR_API_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Start transaction
    const client = await getClient()
    
    try {
      await client.query('BEGIN')

      // Create transaction record
      const transactionResult = await client.query(
        `INSERT INTO transactions (order_id, payment_gateway_id, amount, status, paid_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id`,
        [order_id, razorpay_payment_id, amount, 'success']
      )

      const transactionId = transactionResult.rows[0].id

      // Update order status and link transaction
      await client.query(
        `UPDATE orders 
         SET status = 'paid', transaction_id = $1
         WHERE id = $2`,
        [transactionId, order_id]
      )

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        data: {
          order_id,
          transaction_id: transactionId,
          payment_id: razorpay_payment_id,
        },
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
