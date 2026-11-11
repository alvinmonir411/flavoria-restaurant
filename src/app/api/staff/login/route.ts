import { NextResponse } from 'next/server';
import { verifyStaffCredentials } from '@/lib/db';

const STAFF_TOKEN_COOKIE = 'flv_st_token';

/**
 * POST /api/staff/login
 * Authenticates Admin or Manager strictly with email & password against Neon PostgreSQL.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password.trim() : '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const matchedStaff = await verifyStaffCredentials(email, password);

    if (!matchedStaff) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = `flv_st_${matchedStaff.id}_${Date.now()}`;
    const redirectUrl = matchedStaff.role === 'Admin' ? '/dashboard/admin' : '/dashboard/manager';

    const response = NextResponse.json({
      success: true,
      staff: matchedStaff,
      token,
      role: matchedStaff.role,
      name: matchedStaff.name,
      redirectUrl,
    });

    response.cookies.set(STAFF_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Staff login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service failure.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(STAFF_TOKEN_COOKIE);
  return response;
}
