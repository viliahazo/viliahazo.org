import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/etablissements",
        destination: "/fianarana",
        permanent: true,
      },
      {
        source: "/etablissements/:id",
        destination: "/fianarana/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
