import { query } from '../../../../database/db/client'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

interface SettingRow {
  key: string
  value: string
  updated_at: Date
}

/**
 * GET /api/settings
 * Fetch application settings (cutoff times, limits, etc.)
 * Public endpoint - only exposes safe settings
 */
export async function GET() {
  try {
    // Query settings from database
    const result = await query(
      `SELECT key, value, updated_at
       FROM settings
       WHERE key IN ('self_cutoff_time', 'donate_cutoff_time', 'max_boxes_per_day')
       ORDER BY key ASC`
    )

    // Convert to key-value object
    const settings: Record<string, string> = {}
    for (const row of result.rows as SettingRow[]) {
      settings[row.key] = row.value
    }

    return successResponse({ settings })
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
