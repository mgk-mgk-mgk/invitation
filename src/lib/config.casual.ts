import { weddingCasual } from '../../wedding.casual.config';
import { buildConfig } from '@/lib/config';
import type { WeddingConfig } from '@/types/wedding';

/**
 * 캐주얼판 config — '/casual' 경로로 서빙됩니다.
 * 격식판과 같은 buildConfig 파이프라인(검증·base 보정)을 타고, routeBase 로 공유 URL 만 분리합니다.
 */
export const casualConfig: WeddingConfig = buildConfig(weddingCasual, '/casual');
export default casualConfig;
