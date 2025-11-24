import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export async function requireRole(req, res, roles = []) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return { ok: false, status: 401, error: 'Unauthorized' };
  const userRole = session.user?.role || 'user';
  if (roles.length && !roles.includes(userRole)) {
    return { ok: false, status: 403, error: 'Forbidden' };
  }
  return { ok: true, session };
}
