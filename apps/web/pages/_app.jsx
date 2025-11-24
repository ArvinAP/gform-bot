import { TenantProvider } from '../lib/tenant';

export default function App({ Component, pageProps }) {
  return (
    <TenantProvider>
      <Component {...pageProps} />
    </TenantProvider>
  );
}
