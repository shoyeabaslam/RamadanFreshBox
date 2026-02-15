import { query } from '../../../../database/db/client'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

interface DeliveryBatchRow {
  id: number
  delivery_date: Date
  location: string
  instagram_url: string | null
  created_at: Date
}

/**
 * GET /api/delivery-batches
 * Fetch today's delivery batch (Instagram reel)
 * Public endpoint - no authentication required
 */
export async function GET() {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    // Query today's delivery batch with Instagram URL
    const result = await query(
      `SELECT 
        id, 
        delivery_date, 
        location, 
        instagram_url,
        created_at
      FROM delivery_batches
      WHERE delivery_date = $1 
        AND instagram_url IS NOT NULL 
        AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1`,
      [today]
    )

    // Return the batch if found
    const batch = result.rows.length > 0 
      ? {
          id: (result.rows[0] as DeliveryBatchRow).id,
          delivery_date: (result.rows[0] as DeliveryBatchRow).delivery_date,
          location: (result.rows[0] as DeliveryBatchRow).location,
          instagram_url: (result.rows[0] as DeliveryBatchRow).instagram_url,
        }
      : null

    return successResponse({ batch })
  } catch (error) {
    return handleApiError(error)
  }
}

// Disable other HTTP methods
export async function POST() {
  return errorResponse('Method not allowed', 405)
}

export async function PUT() {
  return errorResponse('Method not allowed', 405)
}

export async function DELETE() {
  return errorResponse('Method not allowed', 405)
}
