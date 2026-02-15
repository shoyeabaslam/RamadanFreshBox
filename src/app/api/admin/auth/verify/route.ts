import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      )
    }

    // Verify session token
    const isValid = verifySessionToken(sessionToken)

    if (!isValid) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
    })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    )
  }
}

function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
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
