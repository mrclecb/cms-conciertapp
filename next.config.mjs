import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() { return [ { source: '/:path*', headers: [ { key: 'Host', value: 'conciert.app' } ], }, ]}
}

export default withPayload(nextConfig)
