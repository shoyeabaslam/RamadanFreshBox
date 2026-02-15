import { query } from '../../../../database/db/client'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

interface PackageRow {
  id: number
  name: string
  fruits_limit: number
  price: string
  highlights: string[]
  display_order: number
  created_at: Date
}

/**
 * GET /api/packages
 * Fetch all active packages with their highlights
 * Public endpoint - no authentication required
 */
export async function GET() {
  try {
    // Query active packages from database
    const result = await query(
      `SELECT 
        id, 
        name, 
        fruits_limit, 
        price, 
        highlights,
        display_order,
        created_at
      FROM packages
      WHERE is_active = TRUE AND deleted_at IS NULL
      ORDER BY display_order ASC, fruits_limit ASC`
    )

    // Return packages with proper type
    const packages = (result.rows as PackageRow[]).map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      fruits_limit: pkg.fruits_limit,
      price: Number.parseFloat(pkg.price),
      highlights: pkg.highlights,
      display_order: pkg.display_order,
    }))

    return successResponse({ packages })
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
