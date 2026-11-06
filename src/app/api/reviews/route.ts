import { NextResponse } from 'next/server';
import { getCustomerReviews, replyToReview } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await getCustomerReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, reply } = body;
    if (!id || !reply) {
      return NextResponse.json({ error: 'Review id and reply required' }, { status: 400 });
    }
    const success = await replyToReview(id, reply);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
