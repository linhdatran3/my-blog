import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ['example.com'], // Domains cho Image optimization
  },
};

export default nextConfig;
// TODO: add @next/bundle-analyzer
//  Next.js Specific Standards
// First Load JS Targets:

// Excellent: < 100KB
// Good: 100-150KB
// Warning: 150-200KB
// Poor: > 200KB

// Per Page Targets:

// Excellent: < 20KB per page
// Good: 20-50KB per page
// Warning: > 50KB per page

//  Your Next.js API Project
// Based on your React Query + API setup:
// Recommended Targets:

// Initial load: < 100KB gzipped
// Per page: < 30KB gzipped
// API utilities: < 10KB gzipped
