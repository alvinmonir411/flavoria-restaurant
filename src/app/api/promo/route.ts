import { NextResponse } from 'next/server';
import { getPromoCodes, validatePromoCode } from '@/lib/db';

export async function GET() {
  try {
    const promoCodes = await getPromoCodes();
    return NextResponse.json({ promoCodes });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.code) {
      return NextResponse.json({ error: 'Promo code required' }, { status: 400 });
    }
    const result = await validatePromoCode(body.code, Number(body.amount || 0));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 });
  }
}
