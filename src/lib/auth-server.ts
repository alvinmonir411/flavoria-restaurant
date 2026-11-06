import { getStaff } from './db';
import { StaffMember, StaffRole } from '@/types';

export interface AuthResult {
  authorized: boolean;
  staff?: StaffMember;
  error?: string;
  statusCode?: number;
}

/**
 * Server-side authorization check for protected Next.js route handlers
 */
export async function verifyStaffAuth(
  request: Request,
  allowedRoles?: StaffRole[]
): Promise<AuthResult> {
  // Allow bypass in local development if specifically configured, but in production enforce strictly
  const authHeader = request.headers.get('authorization') || request.headers.get('x-staff-token');
  
  // Extract token from "Bearer <token>" or raw token header
  let token = authHeader;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // Also check cookie header fallback
  if (!token) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/flv_st_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  if (!token) {
    return {
      authorized: false,
      error: 'Authentication required. Missing staff authorization token.',
      statusCode: 401
    };
  }

  // Extract staff ID from token format: "flv_st_<staffId>_<timestamp>"
  let staffId: string | null = null;
  if (token.startsWith('flv_st_')) {
    const parts = token.split('_');
    if (parts.length >= 3) {
      staffId = parts[2];
    }
  }

  const staffList = await getStaff();
  const matched = staffList.find(s => s.id === staffId || s.pinCode === token);

  if (!matched) {
    return {
      authorized: false,
      error: 'Invalid or expired staff session.',
      statusCode: 401
    };
  }

  // If specific roles required, check role permissions
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(
      r => r.toLowerCase() === matched.role.toLowerCase() ||
           matched.role === 'Owner / Admin' ||
           matched.permissions?.includes('all')
    );

    if (!hasRole) {
      return {
        authorized: false,
        staff: matched,
        error: `Forbidden: Staff role '${matched.role}' is not authorized for this action.`,
        statusCode: 403
      };
    }
  }

  return {
    authorized: true,
    staff: matched
  };
}
