import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/database/db/client'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAuthenticated = verifyAdminSession(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all orders with package details
    const result = await query(
      `SELECT 
        o.id,
        o.customer_name,
        o.phone_number,
        o.address,
        o.delivery_location,
        o.delivery_date,
        o.total_amount,
        o.quantity,
        o.status,
        o.order_type,
        o.sponsor_name,
        o.sponsor_message,
        o.created_at,
        p.name as package_name,
        p.price as package_price
      FROM orders o
      LEFT JOIN packages p ON o.package_id = p.id
      WHERE o.deleted_at IS NULL
      ORDER BY o.created_at DESC`
    )

    return NextResponse.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
