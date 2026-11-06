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
    } else if (pin) {
      matchedStaff = staffList.find(s => s.pinCode === pin.trim());
    } else if (role) {
      matchedStaff = staffList.find(s => s.role.toLowerCase() === role.trim().toLowerCase());
    }

    if (!matchedStaff) {
      return NextResponse.json(
        { success: false, error: 'Staff account not found. Please verify your email or credentials.' },
        { status: 401 }
      );
    }

    // Backend role destination routing
    const roleLower = matchedStaff.role.toLowerCase();
    let redirectUrl = '/management';

    if (
      roleLower.includes('chef') ||
      roleLower.includes('kitchen') ||
      roleLower.includes('cook') ||
      roleLower.includes('pastry') ||
      roleLower.includes('bartender') ||
      roleLower.includes('sommelier')
    ) {
      redirectUrl = '/kitchen';
    } else if (roleLower.includes('driver') || roleLower.includes('delivery')) {
      redirectUrl = '/driver';
    } else {
      redirectUrl = '/management';
    }

    // Generate authenticated session token
    const token = `flv_st_${matchedStaff.id}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      staff: matchedStaff,
      token,
      role: matchedStaff.role,
      name: matchedStaff.name,
      redirectUrl
    });
  } catch (error) {
    console.error('Staff login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}
