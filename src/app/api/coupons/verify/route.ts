import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/database/db/client';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Verify coupon exists and is valid
    const result = await query(
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
      [code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired coupon code' },
        { status: 404 }
      );
    }

    const coupon = result.rows[0];

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: parseFloat(coupon.discount_value),
      },
    });
  } catch (error) {
    console.error('Error verifying coupon:', error);
    return NextResponse.json(
      { error: 'Failed to verify coupon' },
      { status: 500 }
    );
  }
}
