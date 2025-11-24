import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) {
      if (res.error === 'UNAPPROVED') {
        router.push('/awaiting-approval');
        return;
      }
      setError('Invalid credentials or not approved yet');
      return;
    }
    router.push('/');
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 16 }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        <button type="submit">Sign in</button>
      </form>
      <p><a href="/signup">Create an account</a></p>
    </div>
  );
}
