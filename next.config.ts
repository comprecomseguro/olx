/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.olx.com.br",
      },
      {
        protocol: "https",
        hostname: "comprasegura.olx.com.br",
      },
      {
        protocol: "https",
        hostname: "ctqxpmqrxpluanmjdcxj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "https://onfcxnxuapdzgqhbghmy.supabase.co",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_HOST_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_SESSION_COOKIE: process.env.NEXT_SESSION_COOKIE,
  },
};

module.exports = nextConfig;
