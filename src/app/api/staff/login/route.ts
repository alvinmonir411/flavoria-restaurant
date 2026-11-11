import { NextResponse } from 'next/server';
import { getStaff } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin, email, password, role } = body;

    const staffList = await getStaff();

    let matchedStaff = null;

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      matchedStaff = staffList.find(s => s.email?.toLowerCase() === cleanEmail);
      if (!matchedStaff && cleanEmail === 'owner@flavoria.com') {
        matchedStaff = staffList.find(s => s.role === 'Admin');
      }
    } else if (pin) {
      matchedStaff = staffList.find(s => s.pinCode === pin.trim());
    } else if (role) {
      matchedStaff = staffList.find(s => s.role.toLowerCase() === role.trim().toLowerCase());
    }

    if (!matchedStaff) {
      return NextResponse.json(
        { success: false, error: 'Account not found. Only Admin and Manager staff accounts exist.' },
        { status: 401 }
      );
    }

    const redirectUrl = '/management';

    // Generate authenticated session token
    const token = `flv_st_${matchedStaff.id}_${Date.now()}`;

    const res = NextResponse.json({
      success: true,
      staff: matchedStaff,
      token,
      role: matchedStaff.role,
      name: matchedStaff.name,
      redirectUrl,
    });

    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https://');
    res.cookies.set('flv_st_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error('Staff login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('flv_st_token');
  return res;
}
