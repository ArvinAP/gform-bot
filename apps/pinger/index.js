// Simple Render background worker to keep bot/API services awake
// Usage on Render Background Worker:
//   Start Command: node apps/pinger/index.js
//   Env:
//     HEALTH_URLS: space-separated list of health URLs to ping
//       e.g. "https://client-a-bot.onrender.com/health https://client-b-bot.onrender.com/health"
//     INTERVAL_SEC: optional, seconds between pings (default 300 = 5 min)
//     STARTUP_DELAY_SEC: optional, initial delay before first ping (default 5)

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function ping(url) {
  const start = Date.now();
  try {
    const res = await fetch(url, { method: 'GET' });
    const ok = res.ok;
    const ms = Date.now() - start;
    console.log(`[pinger] ${ok ? '200' : res.status} ${url} ${ms}ms`);
  } catch (e) {
    const ms = Date.now() - start;
    console.warn(`[pinger] FAIL ${url} ${ms}ms ${e.message}`);
  }
}

async function main() {
  const urlsVar = process.env.HEALTH_URLS || '';
  const URLS = urlsVar.split(/\s+/).filter(Boolean);
  if (URLS.length === 0) {
    console.error('[pinger] No HEALTH_URLS provided. Set a space-separated list of URLs.');
  }
  const INTERVAL_SEC = Math.max(30, Number(process.env.INTERVAL_SEC) || 300); // default 5 min, min 30s
  const STARTUP_DELAY_SEC = Math.max(0, Number(process.env.STARTUP_DELAY_SEC) || 5);

  console.log(`[pinger] starting. urls=${URLS.length} interval=${INTERVAL_SEC}s startupDelay=${STARTUP_DELAY_SEC}s`);
  if (STARTUP_DELAY_SEC) await sleep(STARTUP_DELAY_SEC * 1000);

  // Loop forever
  while (true) {
    // Add small jitter (+/- 5s) to avoid synchronized spikes if many workers
    const jitterMs = (Math.random() * 10000) - 5000;
    const startCycle = Date.now();

    await Promise.all(URLS.map(u => ping(u)));

    const elapsed = Date.now() - startCycle;
    const waitMs = Math.max(0, (INTERVAL_SEC * 1000 + jitterMs) - elapsed);
    await sleep(waitMs);
  }
}

main().catch((e) => {
  console.error('[pinger] fatal error:', e);
  process.exit(1);
});
