import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setOk(false);
    const res = await fetch('/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password })
    });
    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      setError(j.error || 'Failed to sign up');
      return;
    }
    setOk(true);
    router.push('/awaiting-approval');
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 16 }}>
      <h1>Sign up</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        {ok ? <p style={{ color: 'green' }}>Registered, pending approval.</p> : null}
        <button type="submit">Create account</button>
      </form>
      <p><a href="/login">Back to login</a></p>
    </div>
  );
}
