import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const TenantCtx = createContext({ tenant: null, tenants: [], setTenant: () => {}, apiBase: '' });

function parseTenants() {
  try { return JSON.parse(process.env.NEXT_PUBLIC_TENANTS || '[]'); } catch { return []; }
}

export function TenantProvider({ children }) {
  const tenants = useMemo(() => parseTenants(), []);
  const [tenantName, setTenantName] = useState(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tenant_name') : null;
    if (saved) setTenantName(saved);
    else if (tenants[0]) setTenantName(tenants[0].name);
  }, [tenants]);

  const tenant = tenants.find(t => t.name === tenantName) || tenants[0] || null;
  const apiBase = tenant?.apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  function setTenant(name) {
    setTenantName(name);
    if (typeof window !== 'undefined') localStorage.setItem('tenant_name', name);
  }

  return (
    <TenantCtx.Provider value={{ tenant, tenants, setTenant, apiBase }}>
      {children}
    </TenantCtx.Provider>
  );
}

export function useTenant() {
  return useContext(TenantCtx);
}
