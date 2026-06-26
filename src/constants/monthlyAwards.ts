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

// 이 달의 신인 헬퍼 (2번째 컬럼 — 드라이버 자리 대체)
export const HELPER_RISING_OF_MONTH: MonthlyAward = {
  period: CURRENT_PERIOD,
  role: 'helper',
  winnerId: 'w6',
  winnerName: 'Rani Oktaviani',
  winnerPhoto: W7,
  temperature: 79.5,
  reason: '입주 첫 달 24건 완료 · 재예약률 1위',
};

/** 받는 사람이 좋아할 수준의 은은한 배지 */
export function getMonthlyAwardBadge(workerId: string): MonthlyAward | null {
  if (workerId === HELPER_OF_MONTH.winnerId) return HELPER_OF_MONTH;
  if (workerId === HELPER_RISING_OF_MONTH.winnerId) return HELPER_RISING_OF_MONTH;
  return null;
}
