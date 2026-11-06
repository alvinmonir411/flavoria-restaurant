import { NextResponse } from 'next/server';
import { getAuditLogs, logAuditEvent } from '@/lib/db';

export async function GET() {
  try {
    const logs = await getAuditLogs();
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, category, user, role, details } = body;
    const entry = await logAuditEvent(action, category, user, role, details);
    return NextResponse.json({ log: entry }, { status: 201 });
  } catch (error) {
    console.error('Error logging audit event:', error);
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }
}
