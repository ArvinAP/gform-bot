import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { getDb } from '../../../lib/db';

export const authOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials || {};
        if (!email || !password) return null;
        const db = getDb();
        const snap = await db.collection('users').where('email', '==', String(email).toLowerCase()).limit(1).get();
        if (snap.empty) return null;
        const doc = snap.docs[0];
        const user = { id: doc.id, ...doc.data() };
        if (!user.approved) {
          // Not approved yet
          throw new Error('UNAPPROVED');
        }
        const ok = await bcrypt.compare(password, user.passwordHash || '');
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name || null, role: user.role || 'user', approved: !!user.approved };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.approved = user.approved;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.role = token.role || 'user';
      session.user.approved = token.approved ?? false;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export default handler;
