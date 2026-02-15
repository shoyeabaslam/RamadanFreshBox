import { NextResponse } from 'next/server'

/**
 * Standard API Response Format
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * API Error Handler
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Success Response Helper
 */
export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    data,
    message,
  })
}

/**
 * Error Response Helper
 */
export function errorResponse(error: string, statusCode = 500) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status: statusCode }
  )
}

/**
 * Validation Error Response
 */
export function validationError(message: string) {
  return errorResponse(message, 400)
}

/**
 * Not Found Response
 */
export function notFoundResponse(resource: string) {
  return errorResponse(`${resource} not found`, 404)
}

/**
 * Unauthorized Response
 */
export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401)
}

/**
 * Handle API Errors
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode)
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }

  return errorResponse('An unexpected error occurred', 500)
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  body: T,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `Missing required field: ${String(field)}`
    }
  }
  return null
}

/**
 * Sanitize input to prevent SQL injection
 */
export function sanitizeInput(input: string): string {
  return input.trim().replaceAll(/['"`;\\]/g, '')
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false
  
  const dateObj = new Date(date)
  return !Number.isNaN(dateObj.getTime())
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * In production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}
