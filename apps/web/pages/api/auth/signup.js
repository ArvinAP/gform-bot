import bcrypt from 'bcrypt';
import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email, name, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const db = getDb();
    const norm = String(email).toLowerCase();
    const exists = await db.collection('users').where('email', '==', norm).limit(1).get();
    if (!exists.empty) return res.status(409).json({ error: 'User already exists' });
    const passwordHash = await bcrypt.hash(String(password), 10);
    const now = new Date().toISOString();
    const doc = { email: norm, name: name || null, passwordHash, role: 'user', approved: false, createdAt: now, updatedAt: now };
    const ref = await db.collection('users').add(doc);
    return res.status(201).json({ id: ref.id, pendingApproval: true });
  } catch (e) {
    console.error('[signup] error', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
