import { NextResponse } from 'next/server';
import { getStaff, toggleStaffClockIn } from '@/lib/db';

export async function GET() {
  try {
    const staff = await getStaff();
    return NextResponse.json({ staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Staff ID required' }, { status: 400 });
    }
    const updated = await toggleStaffClockIn(body.id);
    return NextResponse.json({ member: updated });
  } catch (error) {
    console.error('Error toggling clock in:', error);
    return NextResponse.json({ error: 'Failed to toggle clock in' }, { status: 500 });
  }
}
