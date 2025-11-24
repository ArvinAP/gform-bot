import bcrypt from 'bcrypt';
import { getDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (!email || !password) return res.status(400).json({ error: 'Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD env' });
  try {
    const db = getDb();
    const norm = String(email).toLowerCase();
    const snap = await db.collection('users').where('email','==', norm).limit(1).get();
    if (!snap.empty) {
      const doc = snap.docs[0];
      // Ensure role and approved
      await db.collection('users').doc(doc.id).set({ role: 'super_admin', approved: true, updatedAt: new Date().toISOString() }, { merge: true });
      return res.json({ ok: true, id: doc.id, existed: true });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    const now = new Date().toISOString();
    const ref = await db.collection('users').add({ email: norm, name: 'Super Admin', passwordHash, role: 'super_admin', approved: true, createdAt: now, updatedAt: now });
    return res.status(201).json({ ok: true, id: ref.id, existed: false });
  } catch (e) {
    console.error('[bootstrap] error', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
