import { NextResponse } from 'next/server';
import { getGiftCards, createGiftCard } from '@/lib/db';

export async function GET() {
  try {
    const giftCards = await getGiftCards();
    return NextResponse.json({ giftCards });
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return NextResponse.json({ error: 'Failed to fetch gift cards' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.recipientName || !body.recipientEmail || !body.initialBalance) {
      return NextResponse.json({ error: 'Recipient name, email and balance required' }, { status: 400 });
    }
    const card = await createGiftCard({
      initialBalance: Number(body.initialBalance),
      senderName: body.senderName || 'Anonymous Foodie',
      recipientName: body.recipientName,
      recipientEmail: body.recipientEmail,
      message: body.message || 'Enjoy exquisite dining at Flavoria!'
    });
    return NextResponse.json({ card }, { status: 201 });
  } catch (error) {
    console.error('Error creating gift card:', error);
    return NextResponse.json({ error: 'Failed to create gift card' }, { status: 500 });
  }
}
