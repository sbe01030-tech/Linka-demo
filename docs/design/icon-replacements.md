# 홈 카테고리 아이콘 교체 계획

> 사용자가 icons.expo.fyi 에서 고른 새 아이콘들을 모아두는 파일.
> **"이제 적용해줘"** 라고 말씀하시면 한 번에 코드에 반영합니다.
> 적용 위치: [src/screens/customer/HomeScreen.tsx](../../src/screens/customer/HomeScreen.tsx) `CATEGORY_META` 배열

---

## 카테고리 8개 + 적용 현황 (Phosphor SVG 기반)

| ID | 라벨 | 적용된 아이콘 (Phosphor SVG) | 배경색 | 상태 |
|---|---|---|---|---|
| `helper` | 가사도우미 | HelperIcon (청소솔/헤드폰 실루엣) | `#FFF3C0` | ✅ |
| `cooking` | 요리 | CookingIcon (오븐) | `#FFD8D4` | ✅ |
| `cleaning` | 청소 | CleaningIcon (빗자루) | `#C4F5DC` | ✅ |
| `childcare` | 육아 | ChildcareIcon (웃는 얼굴) | `#FFD8EA` | ✅ |
| `driver_designated` | 운전 1 (지정/대리) | DriverDesignatedIcon (자동차) | `#EDE9FE` | ✅ |
| `driver_daily` | 운전 2 (일일) | DriverDailyIcon (자동차, 살짝 다른 형태) | `#FEF3C7` | ✅ |
| `errand` | 심부름 | ErrandIcon (벨/종) | `#FFE4E6` | ✅ |
| `more` | 더보기 | MoreIcon (점 3개) | `#EAEAEF` | ✅ |

**적용 위치:**
- 아이콘 컴포넌트: [src/components/icons/CategoryIcons.tsx](../../src/components/icons/CategoryIcons.tsx)
- 사용처: [src/screens/customer/HomeScreen.tsx](../../src/screens/customer/HomeScreen.tsx) 카테고리 그리드 (CATEGORY_ICONS 매핑)
- 작업 브랜치: `feat/category-icons-phosphor`

**상태 표시:**
- ⏳ 아이콘 미정
- 📌 아이콘 정해짐 (적용 대기)
- ✅ 코드에 반영 완료

---

## ⚠️ 확인 필요

- **운전 1 vs 운전 2** 매핑이 맞는지 사용자 확인 필요
  - "운전 1" (`car-sport-outline`) = `driver_designated` (지정/대리)
  - "운전 2" (`car-sport-sharp`) = `driver_daily` (일일)
  - 바꿔야 하면 알려주세요

---

## 변경 로그

| 날짜 | 변경 내용 |
|---|---|
| 2026-05-20 | cooking·cleaning·childcare·driver_designated·driver_daily 5개 확정 |
| 2026-05-26 | 8개 전부 Phosphor SVG로 코드 반영 완료. Outline + 흰 fill, bg circle 그룹 우측 정렬, driver_daily 피치색으로 차별화 |
| 2026-05-26 | 권한 모드 자동 승인 테스트 — 채팅창 안 가려지는지 확인용 |
