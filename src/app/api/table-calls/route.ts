import { NextResponse } from 'next/server';
import { getTableCalls, createTableCall, resolveTableCall } from '@/lib/db';
import { TableCallRequest } from '@/types';

export async function GET() {
  try {
    const calls = await getTableCalls();
    return NextResponse.json({ calls });
  } catch (error) {
    console.error('Error fetching table calls:', error);
    return NextResponse.json({ error: 'Failed to fetch table calls' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableNumber, type, notes } = body;
    if (!tableNumber || !type) {
      return NextResponse.json({ error: 'Table number and request type required' }, { status: 400 });
    }
    const call = await createTableCall(tableNumber, type as TableCallRequest['type'], notes);
    return NextResponse.json({ call }, { status: 201 });
  } catch (error) {
    console.error('Error creating table call:', error);
    return NextResponse.json({ error: 'Failed to create table call' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: 'Call id required' }, { status: 400 });
    }
    const success = await resolveTableCall(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error resolving table call:', error);
    return NextResponse.json({ error: 'Failed to resolve call' }, { status: 500 });
  }
}
