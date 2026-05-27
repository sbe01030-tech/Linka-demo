# 11. 지도 화면 (Customer Map)

> 파일: [src/screens/map/MapScreen.tsx](../../src/screens/map/MapScreen.tsx)
> 라우트: `Customer Tabs > Map` / `Worker Tabs > WorkerMap` (동일 컴포넌트 재사용)

---

## 1. 목적

고객이 지도 위에서 주변 헬퍼·드라이버를 시각적으로 탐색하고, 필터링·정렬해서 원하는 파트너를 찾아 상세 화면으로 진입한다.

---

## 2. 진입 경로

- 하단 탭바의 "지도(Map)" 탭
- 홈 화면(HomeScreen)의 "지도에서 보기" / 서비스 카드 탭 → `serviceType` 파라미터와 함께 진입 가능
- 라우트 파라미터:
  - `expanded?: boolean` — 진입 시 바텀시트를 펼친 상태로 표시
  - `serviceType?: 'regular' | 'onetime' | 'live-in'` — 진입 시 서비스 유형 필터 미리 적용

---

## 3. 스크린샷

> 캡처 파일은 `./screenshots/map/` 폴더에 저장. 파일명 규칙: `{번호}_{설명}.png`

### 3.1 기본 상태 (지도 + 바텀시트 peek)
![지도 기본 상태](./screenshots/map/01_default.png)

### 3.2 바텀시트 펼친 상태 (리스트 뷰)
![바텀시트 펼침](./screenshots/map/02_expanded.png)

### 3.3 파트너 마커 선택 (상세 미리보기)
![파트너 선택](./screenshots/map/03_marker_selected.png)

### 3.4 활동 카테고리 필터 모달
![활동 필터](./screenshots/map/04_filter_activity.png)

### 3.5 서비스 유형 필터 모달
![서비스 유형 필터](./screenshots/map/05_filter_service.png)

### 3.6 헬퍼 조건 필터 모달 (검증/경력)
![조건 필터](./screenshots/map/06_filter_condition.png)

### 3.7 정렬 모달
![정렬](./screenshots/map/07_sort.png)

---

## 4. UI 구성

### 4.1 상단 검색 바 (오버레이)
- 검색 입력창: 파트너 이름 또는 위치 키워드
- 클리어(X) 버튼

### 4.2 지도 (Google Maps)
- 커스텀 스타일 적용 (밝은 회색 톤, POI/대중교통 라벨 숨김)
- 사용자 현재 위치 표시 (권한 허용 시)
- 파트너 마커: 사진 + 이름 + 평점 표시. 헬퍼/드라이버 색상 구분
  - 헬퍼: 앰버(#F59E0B)
  - 드라이버: 인디고(#6366F1)
- 줌 인/아웃 버튼, 내 위치로 이동 버튼

### 4.3 바텀시트 (2단계)
- **Peek 상태 (240pt)**:
  - 헤더: "n명의 파트너" 카운트 배지
  - 필터 칩 행 (가로 스크롤): 헬퍼·드라이버·서비스유형·즉시가능·검증완료·경력5년+·활동·조건·정렬
  - 스토리 리스트: 파트너 사진 가로 스크롤 (얼굴+이름+가격)
- **Expanded 상태 (화면의 72%)**:
  - 헤더: 카운트 + 정렬 드롭다운
  - 파트너 카드 리스트 (FlatList)
  - 카드 탭 시 헬퍼/드라이버 상세 화면으로 이동

### 4.4 파트너 선택 미리보기 시트
- 마커 탭 시 하단에서 슬라이드 업
- 사진 / 이름 / 평점 / 시급 / 위치 / 스킬 / 경력 / 검증 배지
- "상세 보기" CTA → WorkerDetailScreen / DriverDetailScreen

### 4.5 필터 모달들
1. **활동 카테고리** (다중 선택)
   - cleaning, cooking, laundry, other 카테고리 아래 세부 항목
   - 각 항목은 백엔드 `skill` 필드와 매핑됨
2. **서비스 유형** (단일 선택)
   - regular(정기) / onetime(단기) / live-in(상주)
3. **헬퍼 조건** (검증 토글 + 경력 라디오)
   - 검증된 파트너만
   - 경력: 전체 / 1년+ / 3년+ / 5년+
4. **정렬**
   - 평점순 / 후기 많은순 / 가격 낮은순 / 가격 높은순

---

## 5. 데이터 / 표시 필드 (Partner)

현재 프론트의 mock `Partner` 인터페이스 기준:

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string | 파트너 고유 ID |
| `name` / `firstName` | string | 표시명 |
| `lat`, `lng` | number | 위치 좌표 |
| `rating` | number (0~5) | 평균 평점 |
| `pricePerHour` | number (IDR) | 시급 |
| `isAvailable` | boolean | 현재 즉시 가능 여부 |
| `photo` | string(url) | 프로필 사진 URL |
| `location` | string | 표시용 동네명 (예: Kebayoran Baru) |
| `totalJobs` | number | 누적 작업 건수 (후기 정렬용으로도 활용) |
| `serviceFrequency` | `'regular' \| 'special' \| 'both'` | 정기/단기/둘다 |
| `skills` | string[] | 가능 스킬 목록 (예: Beberes, Masak, Cuci, Setrika, Deep Cleaning, Masak Sehat) |
| `experienceYears` | number | 경력 연수 |
| `isVerified` | boolean | 신원·서류 검증 완료 |
| `partnerType` | `'helper' \| 'driver'` | 파트너 종류 |
| `driverServices?` | string[] | 드라이버 한정 (designated/daily/airport/hourly/commute/intercity/event) |
| `licenseClass?` | string | 드라이버 한정 (예: SIM A, SIM A Umum) |

> **백엔드 합의 필요:** 위 필드는 결국 `HelperProfile` / `DriverProfile` + 집계 통계(`rating`, `totalJobs`, `isAvailable`)의 조합. 즉시 가능 여부(`isAvailable`)는 파트너 본인의 토글인지, 시스템이 스케줄로 판단하는지 정책 결정 필요.

---

## 6. 사용자 액션

| 액션 | 트리거 | 결과 |
|---|---|---|
| 검색 | 검색창 입력 | 파트너 이름·위치 부분 일치 필터 (현재 클라이언트 필터링) |
| 마커 탭 | 지도 마커 클릭 | 파트너 미리보기 시트 표시 |
| 미리보기 → 상세 | "상세 보기" 버튼 | WorkerDetail / DriverDetail로 이동 |
| 파트너 타입 토글 | 헬퍼/드라이버 칩 | 마커·리스트 필터 |
| 서비스 유형 변경 | 조건 모달 | regular/onetime/live-in 필터 |
| 즉시 가능 토글 | 칩 | `isAvailable: true` 만 노출 |
| 검증 토글 | 칩 | `isVerified: true` 만 노출 |
| 경력 5년+ 토글 | 칩 | 빠른 경력 필터 |
| 활동 선택 | 활동 모달 (다중) | 선택된 활동 → skill 매핑 → 필터 |
| 정렬 변경 | 정렬 모달 | 평점/후기/가격 정렬 |
| 내 위치로 | 우측 하단 버튼 | 현재 GPS 좌표로 이동 (권한 필요) |

---

## 7. API 요구사항

### 7.1 파트너 검색 (메인)
```
GET /api/v1/partners
```
**Query 파라미터:**
| 이름 | 타입 | 설명 |
|---|---|---|
| `bbox` | string `swLat,swLng,neLat,neLng` | 지도 가시 영역 (선택, 없으면 기본 지역) |
| `lat`, `lng`, `radius` | number | 또는 반경 검색 (둘 중 하나 방식) |
| `partnerType` | `helper \| driver \| all` | 기본 `all` |
| `serviceType` | `regular \| onetime \| live-in` | 선택 |
| `availableOnly` | boolean | |
| `verifiedOnly` | boolean | |
| `minExperience` | number (years) | 0/1/3/5 |
| `skills` | string[] (반복) | 활동 → skill 매핑 결과 |
| `keyword` | string | 이름·위치 검색 |
| `sortBy` | `rating \| reviews \| price_low \| price_high` | 기본 `rating` |
| `cursor` / `limit` | 페이지네이션 | 리스트 뷰용 |

**응답 예시:**
```json
{
  "items": [
    {
      "id": "p1",
      "name": "Sari Dewi",
      "firstName": "Sari",
      "partnerType": "helper",
      "lat": -6.2440, "lng": 106.8022,
      "photo": "https://cdn.linka.id/u/p1.jpg",
      "location": "Kebayoran Baru",
      "rating": 5.0,
      "totalJobs": 312,
      "pricePerHour": 30000,
      "isAvailable": true,
      "isVerified": true,
      "experienceYears": 10,
      "serviceFrequency": "regular",
      "skills": ["Beberes", "Masak", "Cuci"]
    }
  ],
  "nextCursor": "eyJvZmZzZXQiOjIwfQ==",
  "total": 25
}
```

> **성능 고려:** 마커용 데이터는 가벼워야 함. 리스트 카드용 추가 필드(스킬 등)는 같이 내려도 무방하지만, 매우 많은 마커가 예상되면 마커용/카드용 엔드포인트를 분리하거나 필드 셀렉터 도입 검토.

### 7.2 단일 파트너 상세
```
GET /api/v1/partners/{id}
```
- 미리보기·상세 화면에서 공통 사용.
- 응답: 위 + 자기소개, 후기 요약, 가능 시간대 등 (상세 화면 문서에서 구체화)

### 7.3 활동 카테고리 마스터
```
GET /api/v1/activities
```
- 다국어 라벨(id/ko/en/zh/ja) 포함
- 백엔드와 프론트가 동일한 카테고리·항목·skill 매핑을 공유해야 함
- 응답 예시:
```json
[
  {
    "id": "cleaning",
    "label": { "id": "Kebersihan·Kerapian", "ko": "청소·정리", "en": "Cleaning" },
    "items": [
      { "id": "floor", "label": {...}, "skill": "Beberes" }
    ]
  }
]
```

> **합의 필요:** 카테고리 마스터를 클라이언트 하드코딩으로 둘지, 서버 관리(원격 설정)로 둘지. 신규 카테고리/항목 추가 시 앱 업데이트 없이 반영하려면 서버 관리 권장.

### 7.4 사용자 위치 (참고)
- 디바이스 GPS는 `expo-location`으로 클라이언트가 직접 획득. 서버에 보낼 필요는 없으나, "내 주변 검색"은 위 7.1의 `lat/lng/radius`로 처리.

---

## 8. 비즈니스 로직 / 정책 이슈

다음 항목은 백엔드와 합의 필요:

1. **`isAvailable` 정의** — 파트너 토글인지, 스케줄 기반 자동 판단인지, 둘 다인지
2. **위치 갱신 주기** — 파트너 위치는 등록된 활동 거점인지 실시간 GPS인지 (현재 프론트는 정적 가정)
3. **거리 정렬 미지원** — 현재는 평점/후기/가격만. 거리순 정렬 필요한지 결정
4. **검증(`isVerified`) 기준** — 어떤 서류·절차 통과 시 true인지
5. **헬퍼/드라이버 통합 검색 vs 분리** — 현재는 한 엔드포인트에서 `partnerType` 필터. 향후 드라이버 전용 필드(차종·면허·서비스종류)가 늘어나면 분리 검토
6. **활동 → skill 매핑** — 프론트가 현재 매핑 보유. 서버가 매핑 후 결과만 반환할지, 프론트가 매핑한 skill 배열을 보낼지 결정
7. **검색 빈도/캐싱** — 필터 변경마다 API 호출하면 비용 큼. 디바운싱 + 일정 영역 캐싱 정책 합의
8. **다국어 location 표기** — `location: "Kebayoran Baru"` 같은 동네명을 다국어로 보여줄지 (현재는 인니어 그대로)

---

## 9. 엣지 케이스 / 빈 상태

| 상황 | 화면 동작 |
|---|---|
| 위치 권한 거부 | 기본 데모 영역(Kebayoran Baru) 표시. "내 위치" 버튼 비활성 또는 권한 안내 |
| 파트너 0건 | 빈 상태 메시지 + 필터 초기화 버튼 (현재 미구현 — 추가 필요) |
| 네트워크 에러 | 재시도 토스트 (현재 미구현) |
| 검증되지 않은 파트너 | 카드/마커에서 검증 배지 미노출 |
| 즉시 가능하지 않은 파트너 | "예약 불가" 표기, 예약 버튼 비활성 |
| 매우 많은 마커 (100+) | 마커 클러스터링 필요 여부 검토 |

---

## 10. 미해결 질문 (백엔드와 논의)

- [ ] 파트너 검색 페이지네이션은 cursor 방식 vs offset 방식?
- [ ] 마커 표시용 응답에서 사진을 썸네일 URL과 원본 URL 분리할지?
- [ ] `serviceFrequency`(`regular/special/both`)와 `serviceType`(`regular/onetime/live-in`)의 관계 — 하나로 통합 가능한지?
- [ ] 드라이버의 `driverServices`(designated/daily/airport 등)는 별도 필터로 노출 필요한지? (현재 미노출)
