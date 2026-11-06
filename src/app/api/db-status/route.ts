import { NextResponse } from 'next/server';
import { isNeonConfigured, ensureNeonSchema, resetLocalStore, getNeonSql } from '@/lib/db';

export async function GET() {
  const isConfigured = isNeonConfigured();
  let isConnected = false;
  let errorMsg = null;

  if (isConfigured) {
    try {
      const sql = getNeonSql();
      if (sql) {
        await sql`SELECT 1`;
        await ensureNeonSchema();
        isConnected = true;
      }
    } catch (err: unknown) {
      isConnected = false;
      errorMsg = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    configured: isConfigured,
    connected: isConnected,
    mode: isConnected ? 'neon-postgresql' : 'in-memory-fallback',
    message: isConnected 
      ? 'Successfully connected to Neon Serverless PostgreSQL'
      : (isConfigured 
          ? `Neon connection attempted but failed: ${errorMsg}. Running safely on local memory store.` 
          : 'DATABASE_URL is not set. Running safely on pre-seeded memory store.')
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'reset_seeds') {
      resetLocalStore();
      return NextResponse.json({ success: true, message: 'Sample store refreshed with luxury seed data.' });
    }
    if (body.action === 'init_schema') {
      const ok = await ensureNeonSchema();
      return NextResponse.json({ success: ok, message: ok ? 'Neon schema verified and tables ensured.' : 'Schema initialization could not run.' });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
