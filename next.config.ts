import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Makes Cloudflare bindings (e.g. the `hackaton_db` D1 binding) available to
// `getCloudflareContext()` during local `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
