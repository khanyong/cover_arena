import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import { verifyV4PdfArtifact } from './lib/temsco/v4-pdf-artifact.mjs';
import { verifyPreNdaPdfArtifact } from './lib/temsco/pre-nda-pdf-artifact.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingIncludes: {
    '/api/temsco/pre-nda-pdf': ['./public/temsco/pre-nda/pdf/manifest.json'],
  },
};

export default function config(phase) {
  if (phase === PHASE_PRODUCTION_BUILD) {
    verifyV4PdfArtifact();
    verifyPreNdaPdfArtifact();
  }
  return nextConfig;
}
