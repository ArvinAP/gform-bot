import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      signIn();
      return;
    }
    if (!['admin','super_admin'].includes(session.user?.role)) {
      setError('Forbidden');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const p = await fetch('/api/admin/users?status=pending').then(r=>r.json());
        const a = await fetch('/api/admin/users?status=approved').then(r=>r.json());
        setPending(p.users || []);
        setApproved(a.users || []);
      } catch (e) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    })();
  }, [status, session]);

  async function act(body) {
    const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) return alert('Action failed');
    // reload lists
    const p = await fetch('/api/admin/users?status=pending').then(r=>r.json());
    const a = await fetch('/api/admin/users?status=approved').then(r=>r.json());
    setPending(p.users || []);
    setApproved(a.users || []);
  }

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (error) return <div style={{ padding: 16, color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 16 }}>
      <h1>Admin</h1>

      <section>
        <h2>Pending Users</h2>
        {!pending.length ? <p>None</p> : (
          <table>
            <thead>
              <tr><th>Email</th><th>Name</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {pending.map(u => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.name || ''}</td>
                  <td>
                    <button onClick={()=>act({ action:'approve', userId: u.id })}>Approve</button>
                    <button onClick={()=>act({ action:'deny', userId: u.id })} style={{ marginLeft: 8 }}>Deny</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Approved Users</h2>
        {!approved.length ? <p>None</p> : (
          <table>
            <thead>
              <tr><th>Email</th><th>Name</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {approved.map(u => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.name || ''}</td>
                  <td>{u.role}</td>
                  <td>
                    <select defaultValue={u.role} onChange={(e)=>act({ action:'setRole', userId: u.id, role: e.target.value })}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
