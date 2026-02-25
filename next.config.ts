/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora los errores de ESLint durante el despliegue
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora los errores de tipos estrictos durante el despliegue
    ignoreBuildErrors: true,
  },
};

export default nextConfig;