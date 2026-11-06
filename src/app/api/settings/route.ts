import { NextResponse } from 'next/server';
import { getRestaurantSettings, updateRestaurantSettings } from '@/lib/db';
import { verifyStaffAuth } from '@/lib/auth-server';

export async function GET() {
  try {
    const settings = await getRestaurantSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyStaffAuth(request, ['Owner / Admin']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const body = await request.json();
    const updated = await updateRestaurantSettings(body);
    return NextResponse.json({ settings: updated });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
