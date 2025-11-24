import firebasePkg from '@monorepo/firebase';

const { getDb: getAdminDb } = firebasePkg || {};

export function getDb() {
  const db = getAdminDb ? getAdminDb() : null;
  if (!db) throw new Error('Firestore is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  return db;
}
