import { TenantProvider } from '../lib/tenant';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <TenantProvider>
        <Component {...pageProps} />
      </TenantProvider>
    </SessionProvider>
  );
}
