import { query } from '../../../../database/db/client'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

interface FruitRow {
  id: number
  name: string
  is_available: boolean
  created_at: Date
}

/**
 * GET /api/fruits
 * Fetch all available fruits
 * Public endpoint - no authentication required
 */
export async function GET() {
  try {
    // Query available fruits from database
    const result = await query(
      `SELECT 
        id, 
        name, 
        is_available,
        created_at
      FROM fruits
      WHERE is_available = TRUE AND deleted_at IS NULL
      ORDER BY name ASC`
    )

    // Return fruits with proper type
    const fruits = (result.rows as FruitRow[]).map((fruit) => ({
      id: fruit.id,
      name: fruit.name,
      is_available: fruit.is_available,
    }))

    return successResponse({ fruits })
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
