import { useTenant } from '../lib/tenant';

export default function NavBar() {
  const { tenants, tenant, setTenant } = useTenant();
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 60, background: '#fff', borderBottom: '1px solid #eee' }}>
      <nav style={{ display: 'flex', gap: 12, padding: '10px 16px', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <a href="/" style={{ textDecoration: 'none', color: '#0366d6' }}>Dashboard</a>
        <a href="/calendar" style={{ textDecoration: 'none', color: '#0366d6' }}>Calendar</a>
        <a href="/templates" style={{ textDecoration: 'none', color: '#0366d6' }}>Templates</a>
        <div style={{ marginLeft: 'auto' }}>
          {Array.isArray(tenants) && tenants.length > 0 && (
            <select value={tenant?.name || ''} onChange={(e)=>setTenant(e.target.value)} style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6 }}>
              {tenants.map(t => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
          )}
        </div>
      </nav>
    </header>
  );
}
