import { NextRequest } from 'next/server'
import { query, getClient } from '../../../../database/db/client'
import {
  successResponse,
  errorResponse,
  handleApiError,
  validateRequiredFields,
  sanitizeInput,
  isValidPhoneNumber,
  isValidDate,
  checkRateLimit,
} from '@/lib/api-utils'

interface OrderRequest extends Record<string, unknown> {
  package_id: number
  quantity: number
  order_type: 'self' | 'donate' | 'sponsor'
  delivery_date: string
  delivery_location?: string
  customer_name: string
  phone_number: string
  address?: string
  fruit_ids: number[]
  sponsor_name?: string
  sponsor_message?: string
  coupon_code?: string
}

// Helper function to validate basic order data
function validateBasicOrderData(body: OrderRequest) {
  if (!['self', 'donate', 'sponsor'].includes(body.order_type)) {
    return 'Invalid order type'
  }

  if (!isValidPhoneNumber(body.phone_number)) {
    return 'Invalid phone number format'
  }

  if (!isValidDate(body.delivery_date)) {
    return 'Invalid delivery date format'
  }

  const deliveryDate = new Date(body.delivery_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (deliveryDate < today) {
    return 'Delivery date cannot be in the past'
  }

  if (body.quantity < 1 || body.quantity > 100) {
    return 'Quantity must be between 1 and 100'
  }

  return null
}

// Helper function to check cutoff time
async function checkCutoffTime(orderType: string, deliveryDate: string) {
  const now = new Date()
  const delivery = new Date(deliveryDate)
  
  // Only check cutoff for today's deliveries
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  delivery.setHours(0, 0, 0, 0)
  
  if (delivery.getTime() !== today.getTime()) {
    return null // Not ordering for today, no cutoff applies
  }
  
  // Fetch settings from database
  const settingsResult = await query('SELECT key, value FROM settings')
  const settings = settingsResult.rows.reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {} as Record<string, string>)
  
  const cutoffTimeKey = orderType === 'self' ? 'self_cutoff_time' : 'donate_cutoff_time'
  const cutoffTime = settings[cutoffTimeKey]
  
  if (!cutoffTime) {
    return null // No cutoff time set
  }
  
  // Parse cutoff time (format: "HH:MM")
  const [cutoffHours, cutoffMinutes] = cutoffTime.split(':').map(Number)
  
  // Get current time
  const currentHours = now.getHours()
  const currentMinutes = now.getMinutes()
  
  // Convert to minutes for easier comparison
  const currentTotalMinutes = currentHours * 60 + currentMinutes
  const cutoffTotalMinutes = cutoffHours * 60 + cutoffMinutes
  
  if (currentTotalMinutes >= cutoffTotalMinutes) {
    // Format time for user-friendly message
    const period = cutoffHours >= 12 ? 'PM' : 'AM'
    const hours12 = cutoffHours % 12 || 12
    const formattedTime = `${hours12}:${cutoffMinutes.toString().padStart(2, '0')} ${period}`
    
    return `Orders for today must be placed before ${formattedTime}. Please select a different delivery date.`
  }
  
  return null
}

// Helper function to validate order type specific requirements
function validateOrderTypeRequirements(body: OrderRequest) {
  if (body.order_type === 'self' && !body.address) {
    return 'Address is required for self orders'
  }

  if ((body.order_type === 'donate' || body.order_type === 'sponsor') && !body.delivery_location) {
    return 'Delivery location is required for donate/sponsor orders'
  }

  return null
}

// Helper function to sanitize all order inputs
function sanitizeOrderInputs(body: OrderRequest) {
  return {
    sanitizedName: sanitizeInput(body.customer_name),
    sanitizedPhone: sanitizeInput(body.phone_number),
    sanitizedAddress: body.address ? sanitizeInput(body.address) : null,
    sanitizedLocation: body.delivery_location ? sanitizeInput(body.delivery_location) : null,
    sanitizedSponsorName: body.sponsor_name ? sanitizeInput(body.sponsor_name) : null,
    sanitizedSponsorMessage: body.sponsor_message ? sanitizeInput(body.sponsor_message) : null,
  }
}

/**
 * POST /api/orders
 * Create a new order
 * Public endpoint with rate limiting
 */
export async function POST(request: NextRequest) {
  const client = await getClient()

  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip, 5, 60000)) {
      return errorResponse('Too many requests. Please try again later.', 429)
    }

    // Parse and validate request body
    const body = (await request.json()) as OrderRequest

    const fieldError = validateRequiredFields(body, [
      'package_id',
      'quantity',
      'order_type',
      'delivery_date',
      'customer_name',
      'phone_number',
      'fruit_ids',
    ])

    if (fieldError) {
      return errorResponse(fieldError, 400)
    }

    const basicError = validateBasicOrderData(body)
    if (basicError) {
      return errorResponse(basicError, 400)
    }

    const typeError = validateOrderTypeRequirements(body)
    if (typeError) {
      return errorResponse(typeError, 400)
    }

    // Check cutoff time for today's orders
    const cutoffError = await checkCutoffTime(body.order_type, body.delivery_date)
    if (cutoffError) {
      return errorResponse(cutoffError, 400)
    }

    // Start transaction
    await client.query('BEGIN')

    // Verify package exists and get details
    const packageResult = await client.query(
      `SELECT id, fruits_limit, price 
       FROM packages 
       WHERE id = $1 AND is_active = TRUE AND deleted_at IS NULL`,
      [body.package_id]
    )

    if (packageResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return errorResponse('Package not found', 404)
    }

    const pkg = packageResult.rows[0] as { id: number; fruits_limit: number; price: string }

    // Validate fruit count matches package limit
    if (body.fruit_ids.length !== pkg.fruits_limit) {
      await client.query('ROLLBACK')
      return errorResponse(
        `You must select exactly ${pkg.fruits_limit} fruits for this package`,
        400
      )
    }

    // Verify all fruits exist and are available
    const fruitsResult = await client.query(
      `SELECT id FROM fruits 
       WHERE id = ANY($1) AND is_available = TRUE AND deleted_at IS NULL`,
      [body.fruit_ids]
    )

    if (fruitsResult.rows.length !== body.fruit_ids.length) {
      await client.query('ROLLBACK')
      return errorResponse('One or more selected fruits are not available', 400)
    }

    // Calculate total amount
    let totalAmount = Number.parseFloat(pkg.price) * body.quantity
    let discountAmount = 0
    let couponId: number | null = null

    // Verify and apply coupon if provided
    if (body.coupon_code) {
      const couponResult = await client.query(
        `SELECT 
          id,
          code,
          discount_type,
          discount_value,
          valid_from,
          valid_until,
          is_active
        FROM coupons
        WHERE UPPER(code) = UPPER($1)
        AND is_active = TRUE
        AND valid_from <= CURRENT_DATE
        AND valid_until >= CURRENT_DATE`,
        [body.coupon_code]
      )

      if (couponResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return errorResponse('Invalid or expired coupon code', 400)
      }

      const coupon = couponResult.rows[0] as {
        id: number
        discount_type: 'percentage' | 'fixed'
        discount_value: string
      }

      couponId = coupon.id
      const discountValue = Number.parseFloat(coupon.discount_value)

      // Calculate discount
      if (coupon.discount_type === 'percentage') {
        discountAmount = (totalAmount * discountValue) / 100
      } else {
        discountAmount = discountValue
      }

      // Ensure discount doesn't exceed total
      discountAmount = Math.min(discountAmount, totalAmount)
      totalAmount = totalAmount - discountAmount
    }

    // Sanitize inputs
    const sanitized = sanitizeOrderInputs(body)

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (
        package_id, quantity, order_type, delivery_date, delivery_location,
        customer_name, phone_number, address, total_amount, status,
        sponsor_name, sponsor_message, coupon_id, discount_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        body.package_id,
        body.quantity,
        body.order_type,
        body.delivery_date,
        sanitized.sanitizedLocation,
        sanitized.sanitizedName,
        sanitized.sanitizedPhone,
        sanitized.sanitizedAddress,
        totalAmount,
        'pending',
        sanitized.sanitizedSponsorName,
        sanitized.sanitizedSponsorMessage,
        couponId,
        discountAmount,
      ]
    )

    const orderId = orderResult.rows[0].id as number

    // Insert order fruits
    for (const fruitId of body.fruit_ids) {
      await client.query(
        'INSERT INTO order_fruits (order_id, fruit_id) VALUES ($1, $2)',
        [orderId, fruitId]
      )
    }

    // Commit transaction
    await client.query('COMMIT')

    return successResponse(
      {
        order_id: orderId,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        status: 'pending',
        message: 'Order created successfully',
      },
      'Order created successfully'
    )
  } catch (error) {
    await client.query('ROLLBACK')
    return handleApiError(error)
  } finally {
    client.release()
  }
}

/**
 * GET /api/orders
 * Fetch orders by phone number
 * Public endpoint with rate limiting
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip, 10, 60000)) {
      return errorResponse('Too many requests. Please try again later.', 429)
    }

    const { searchParams } = new URL(request.url)
    const phoneNumber = searchParams.get('phone')

    if (!phoneNumber) {
      return errorResponse('Phone number is required', 400)
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return errorResponse('Invalid phone number format', 400)
    }

    // Query orders
    const result = await query(
      `SELECT 
        o.id,
        o.package_id,
        p.name as package_name,
        o.quantity,
        o.order_type,
        o.delivery_date,
        o.delivery_location,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      JOIN packages p ON o.package_id = p.id
      WHERE o.phone_number = $1 
        AND o.deleted_at IS NULL
      ORDER BY o.created_at DESC
      LIMIT 10`,
      [phoneNumber]
    )

    return successResponse({ orders: result.rows })
  } catch (error) {
    return handleApiError(error)
  }
}

// Disable other HTTP methods
export async function PUT() {
  return errorResponse('Method not allowed', 405)
}

export async function DELETE() {
  return errorResponse('Method not allowed', 405)
}
