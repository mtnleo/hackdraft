import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: no incremental cache (R2) needed — the ideas API is
// force-dynamic and the pages are static, so there is no ISR / on-demand
// revalidation surface to cache.
export default defineCloudflareConfig({});
