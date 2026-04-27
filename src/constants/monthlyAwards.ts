/**
 * 이 달의 헬퍼 / 이 달의 드라이버 mock 데이터
 * 실제 서비스에서는 월별 집계로 자동 선정
 */
import { W1, W7 } from './photos';
import { MonthlyAward } from '../types';

// 현재 월 (2026-04)
export const CURRENT_PERIOD = '2026-04';

export const HELPER_OF_MONTH: MonthlyAward = {
  period: CURRENT_PERIOD,
  role: 'helper',
  winnerId: 'w1',
  winnerName: 'Sari Dewi',
  winnerPhoto: W1,
  temperature: 84.2,
  reason: '지난달 32건 완료 · 모든 리뷰에서 긍정 태그',
};

export const DRIVER_OF_MONTH: MonthlyAward = {
  period: CURRENT_PERIOD,
  role: 'driver',
  winnerId: 'd1',
  winnerName: 'Rahmat Hidayat',
  winnerPhoto: W7,
  temperature: 72.3,
  reason: '안전 운행 100% · 공항·행사 기사로 가장 많은 픽업',
};

/** 받는 사람이 좋아할 수준의 은은한 배지 */
export function getMonthlyAwardBadge(workerId: string): MonthlyAward | null {
  if (workerId === HELPER_OF_MONTH.winnerId) return HELPER_OF_MONTH;
  if (workerId === DRIVER_OF_MONTH.winnerId) return DRIVER_OF_MONTH;
  return null;
}
