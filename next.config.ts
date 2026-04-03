import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_POLL_CLICKUP_MS: process.env.POLL_CLICKUP_MS || '60000',
    NEXT_PUBLIC_POLL_CALENDAR_MS: process.env.POLL_CALENDAR_MS || '300000',
    NEXT_PUBLIC_POLL_FRAMEIO_MS: process.env.POLL_FRAMEIO_MS || '600000',
  },
};

export default nextConfig;
