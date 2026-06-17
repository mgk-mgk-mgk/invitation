import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { loadEnv } from 'vite';

// .env(로컬) 또는 CI 가 써준 .env 에서 배포 좌표를 읽습니다.
const { PUBLIC_SITE_ORIGIN, PUBLIC_BASE_PATH } = loadEnv(
  process.env.NODE_ENV || 'production',
  process.cwd(),
  '',
);

// GitHub Pages 프로젝트 repo: 사이트는 https://<유저>.github.io/<repo>/ 로 서빙됩니다.
//   site = 오리진(https://<유저>.github.io), base = /<repo>
// 로컬/미설정 시 base '/' 로 동작(루트). og:url·공유 링크·절대 og:image 기준이 됩니다.
const SITE = PUBLIC_SITE_ORIGIN || 'https://example.github.io';
const BASE = PUBLIC_BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  // output 기본값이 'static'(SSG) — 별도 어댑터 불필요.
  integrations: [preact()],
  // 이미지를 src/assets로 옮기고 astro:assets <Image>를 쓰면 빌드타임 AVIF/WebP 최적화가 켜집니다.
  image: {},
});
