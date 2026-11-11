import { NextResponse } from 'next/server';
import { getExpenses, createExpense } from '@/lib/db';
import { verifyStaffAuth } from '@/lib/auth-server';

export async function GET(request: Request) {
  try {
    const auth = await verifyStaffAuth(request, ['Admin', 'Manager']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const expenses = await getExpenses();
    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyStaffAuth(request, ['Admin', 'Manager']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const body = await request.json();
    const newExp = await createExpense(body);
    return NextResponse.json({ expense: newExp }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
