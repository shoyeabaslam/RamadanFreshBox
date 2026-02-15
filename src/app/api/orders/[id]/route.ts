import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/database/db/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    if (!orderId || Number.isNaN(Number(orderId))) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      )
    }

    // Fetch order details with package name
    const result = await query(
      `SELECT 
        o.id as order_id,
        o.customer_name,
        o.phone_number,
        o.delivery_date,
        o.address,
        o.total_amount,
        o.quantity,
        o.order_type,
        o.status,
        o.transaction_id,
        p.name as package_name
       FROM orders o
       JOIN packages p ON o.package_id = p.id
       WHERE o.id = $1 AND o.deleted_at IS NULL`,
      [orderId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}
