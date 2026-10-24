import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import { verifyV4PdfArtifact } from './lib/temsco/v4-pdf-artifact.mjs';
import { verifyPreNdaPdfArtifact } from './lib/temsco/pre-nda-pdf-artifact.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  outputFileTracingIncludes: {
    '/api/novel-book-epub': ['./assets/book-covers/**', './node_modules/@sparticuz/chromium/bin/**'],
    '/api/temsco/equity-report': ['./private/temsco/equity-report.enc.json'],
    '/api/temsco/pre-nda-pdf': ['./public/temsco/pre-nda/pdf/manifest.json'],
    '/api/novel-book-pdf': [
      './assets/book-fonts/**',
      './node_modules/@sparticuz/chromium/bin/**',
      './node_modules/katex/dist/katex.min.css',
      './node_modules/katex/dist/fonts/*.woff2',
    ],
  },
};

export default function config(phase) {
  if (phase === PHASE_PRODUCTION_BUILD) {
    verifyV4PdfArtifact();
    verifyPreNdaPdfArtifact();
  }
  return nextConfig;
}
