import { NextRequest } from 'next/server'

export function verifyAdminSession(request: NextRequest): boolean {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      return false
    }

    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8')
    const [username, timestamp] = decoded.split(':')

    // Verify username matches
    if (username !== process.env.ADMIN_USERNAME) {
      return false
    }

    // Check if session is expired (8 hours)
    const sessionTime = Number.parseInt(timestamp)
    const now = Date.now()
    const eightHours = 8 * 60 * 60 * 1000

    if (now - sessionTime > eightHours) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export function requireAdmin(request: NextRequest) {
  const isAdmin = verifyAdminSession(request)
  
  if (!isAdmin) {
    throw new Error('Unauthorized access')
  }
  
  return true
}
