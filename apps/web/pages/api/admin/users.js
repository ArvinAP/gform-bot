import { getDb } from '../../../lib/db';
import { requireRole } from '../../../lib/auth-helpers';

export default async function handler(req, res) {
  const gate = await requireRole(req, res, ['admin', 'super_admin']);
  if (!gate.ok) return res.status(gate.status).json({ error: gate.error });
  const db = getDb();

  if (req.method === 'GET') {
    const status = req.query.status || 'pending';
    let q = db.collection('users');
    if (status === 'pending') q = q.where('approved', '==', false);
    if (status === 'approved') q = q.where('approved', '==', true);
    const snap = await q.orderBy('createdAt', 'asc').limit(100).get();
    const users = snap.docs.map(d => ({ id: d.id, ...d.data(), passwordHash: undefined }));
    return res.json({ users });
  }

  if (req.method === 'POST') {
    const { action, userId, role } = req.body || {};
    if (!action || !userId) return res.status(400).json({ error: 'Missing action or userId' });
    const ref = db.collection('users').doc(String(userId));
    const now = new Date().toISOString();

    if (action === 'approve') {
      await ref.set({ approved: true, updatedAt: now }, { merge: true });
      return res.json({ ok: true });
    }
    if (action === 'deny') {
      await ref.delete();
      return res.json({ ok: true });
    }
    if (action === 'setRole') {
      if (!role || !['user','admin','super_admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
      await ref.set({ role, updatedAt: now }, { merge: true });
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
