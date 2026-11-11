import { NextResponse } from 'next/server';
import {
  ensureNeonSchema,
  getNeonSql,
  isNeonConfigured,
  logAuditEvent,
  revalidateAllDatabaseCaches,
} from '@/lib/db';
import { verifyStaffAuth } from '@/lib/auth-server';

export async function GET() {
  const configured = isNeonConfigured();
  if (!configured) {
    return NextResponse.json(
      {
        configured: false,
        connected: false,
        mode: 'neon-postgresql-only',
        cacheStrategy: 'static-first-tag-cached',
        message: 'DATABASE_URL environment variable is missing. Neon PostgreSQL is required.',
      },
      { status: 500 }
    );
  }

  try {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const [timeRow] = await sql`SELECT NOW() AS server_time`;
    const [countsRow] = await sql`
      SELECT
        (SELECT COUNT(*)::int FROM menu_items) AS menu_items,
        (SELECT COUNT(*)::int FROM reservations) AS reservations,
        (SELECT COUNT(*)::int FROM orders) AS orders,
        (SELECT COUNT(*)::int FROM dining_tables) AS dining_tables,
        (SELECT COUNT(*)::int FROM staff_members) AS staff_members,
        (SELECT COUNT(*)::int FROM inventory_items) AS inventory_items
    `;

    return NextResponse.json({
      configured: true,
      connected: true,
      mode: 'neon-postgresql-only',
      cacheStrategy: 'static-first-tag-cached',
      serverTime: timeRow?.server_time ?? new Date().toISOString(),
      counts: countsRow ?? {},
      message: 'Neon PostgreSQL active in Database-Only mode with instant tag revalidation.',
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Neon database connection failed';
    return NextResponse.json(
      {
        configured: true,
        connected: false,
        mode: 'neon-postgresql-only',
        cacheStrategy: 'static-first-tag-cached',
        error: errMsg,
        message: 'Failed to connect to Neon PostgreSQL database.',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyStaffAuth(req, ['Admin', 'Manager']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const body = await req.json();
    const action = body?.action;

    if (action === 'init_schema' || action === 'revalidate_cache') {
      await ensureNeonSchema();
      await revalidateAllDatabaseCaches();
      await logAuditEvent(
        action === 'init_schema' ? 'Schema Sync & Re-Cache' : 'Manual Cache Purge & Re-Warm',
        'System',
        auth.staff?.name || 'Admin',
        auth.staff?.role || 'Admin',
        `Triggered ${action} across all 20 Neon PostgreSQL tables.`
      );

      return NextResponse.json({
        success: true,
        mode: 'neon-postgresql-only',
        message:
          action === 'init_schema'
            ? 'Neon PostgreSQL schema verified and all caches re-warmed.'
            : 'Cache cleared immediately and re-populated with fresh Neon PostgreSQL data.',
      });
    }

    return NextResponse.json({ error: 'Invalid database action.' }, { status: 400 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to execute database action';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
