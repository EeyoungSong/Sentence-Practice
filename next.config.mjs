import dotenv from 'dotenv';
import path from 'path';

// .env 파일을 env 폴더에서 로드
dotenv.config({ path: path.resolve(process.cwd(), 'env/.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
