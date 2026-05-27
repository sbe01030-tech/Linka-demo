# Linka 백엔드 기획안

> React Native(Expo) 기반 인도네시아 타겟 가사도우미·드라이버·심부름 중개 앱.
> 이 문서는 프론트엔드 기준의 화면별 요구사항을 정리한 것이며, 백엔드 API/데이터 모델 설계의 출발점이 됩니다.

---

## 0. 공통 사항

### 0.1 사용자 역할 (Role)
- `customer` — 서비스 요청자 (가사/운전/심부름 의뢰)
- `helper` — 가사도우미 (ART)
- `driver` — 운전자 (고객 차량을 모는 대리/일일 기사)
- `errand` — 심부름꾼 (예정/검토)

> 참고: 한 사용자가 여러 역할을 동시에 가질 수 있는지 여부는 정책 결정 필요. 현재 프론트는 가입 시 하나의 역할 선택을 가정.

### 0.2 다국어
- 지원 언어: `id`(인도네시아·기본), `en`, `ko`, `zh`, `ja`
- 모든 사용자 입력(이름, 자기소개, 리뷰 등)은 원문 그대로 저장. 시스템 메시지·카테고리 마스터만 번역 키 보유.

### 0.3 통화·지역
- 통화: IDR (Rp) — 정수 단위 저장 권장
- 기본 지역: 자카르타 (Jakarta) — 기본 지도 중심: Kemang/Kebayoran Baru
- 좌표계: WGS84 (lat/lng)

### 0.4 인증
- 회원가입/로그인 (이메일·전화번호 기준 — 정책 결정 필요)
- 토큰 기반 세션 (JWT 예상)
- 약관 동의 이력 보관 필수

### 0.5 미디어
- 프로필 사진, 게시물 이미지, 채팅 첨부 이미지
- CDN/스토리지 업로드 흐름 (Pre-signed URL 패턴 권장)

---

## 1. 화면 목록

각 화면은 별도 문서로 상세 작성. 진행 상황은 체크박스로 표시.

### 인증 (Auth)
- [ ] [01-splash.md](./01-splash.md) — 스플래시
- [ ] [02-welcome.md](./02-welcome.md) — 환영 화면 (역할 선택)
- [ ] [03-login.md](./03-login.md) — 로그인
- [ ] [04-register.md](./04-register.md) — 회원가입
- [ ] [05-terms.md](./05-terms.md) — 약관

### 고객 (Customer)
- [ ] [10-customer-home.md](./10-customer-home.md) — 홈
- [x] [11-customer-map.md](./11-customer-map.md) — **지도 (파트너 탐색)** ← 우선 작성
- [ ] [12-customer-search.md](./12-customer-search.md) — 헬퍼 검색
- [ ] [13-customer-worker-detail.md](./13-customer-worker-detail.md) — 헬퍼 상세
- [ ] [14-customer-booking.md](./14-customer-booking.md) — 예약
- [ ] [15-customer-orders.md](./15-customer-orders.md) — 주문 내역
- [ ] [16-customer-review.md](./16-customer-review.md) — 리뷰 작성
- [ ] [17-customer-profile.md](./17-customer-profile.md) — 프로필
- [ ] [18-customer-notifications.md](./18-customer-notifications.md) — 알림

### 헬퍼 (Worker / Helper)
- [ ] [20-worker-home.md](./20-worker-home.md) — 헬퍼 홈
- [ ] [21-worker-orders.md](./21-worker-orders.md) — 헬퍼 주문
- [ ] [22-worker-profile.md](./22-worker-profile.md) — 헬퍼 프로필

### 드라이버 (Driver)
- [ ] [30-driver-board.md](./30-driver-board.md) — 드라이버 게시판
- [ ] [31-driver-detail.md](./31-driver-detail.md) — 드라이버 상세

### 심부름 (Errand)
- [ ] [40-errand-board.md](./40-errand-board.md) — 심부름 게시판
- [ ] [41-errand-create.md](./41-errand-create.md) — 심부름 등록
- [ ] [42-errand-detail.md](./42-errand-detail.md) — 심부름 상세

### 채팅 (Chat)
- [ ] [50-chat-list.md](./50-chat-list.md) — 채팅 목록
- [ ] [51-chat-detail.md](./51-chat-detail.md) — 채팅 상세

### 공통 (Common)
- [ ] [60-edit-profile.md](./60-edit-profile.md) — 프로필 수정
- [ ] [61-help-faq.md](./61-help-faq.md) — 도움말 / FAQ

> **삭제 예정:** 커뮤니티 탭 (CommunityScreen / CreatePost / PostDetail) — 본 기획안에서 제외.

---

## 2. 데이터 모델 개요 (초안)

문서 작성하면서 점진적으로 구체화 예정. 핵심 엔티티만 우선 나열.

| 엔티티 | 핵심 필드 | 비고 |
|---|---|---|
| `User` | id, role, name, phone, email, lang, createdAt | 역할별 확장 프로필 분리 |
| `HelperProfile` | userId, photo, location, rating, pricePerHour, skills[], experienceYears, isVerified, serviceFrequency | 헬퍼 전용 |
| `DriverProfile` | userId, photo, rating, pricePerHour, vehicleTypes[], driverServices[], licenseClass | 드라이버 전용 |
| `Booking` | id, customerId, partnerId, type, scheduledAt, status, address, totalPrice | 예약·주문 |
| `Review` | id, bookingId, rating, comment, createdAt | 후기 |
| `ChatRoom` / `Message` | … | 채팅 |
| `ErrandRequest` | id, customerId, type, description, location, budget, status | 심부름 게시 |
| `Notification` | id, userId, type, payload, readAt | 알림 |

---

## 3. 각 화면 문서 작성 규칙

각 화면 문서는 다음 섹션을 포함:

1. **목적** — 한 줄 요약
2. **진입 경로** — 어디서 들어오는지
3. **스크린샷** — `./screenshots/{화면명}/` 폴더에 이미지 첨부
4. **UI 구성** — 영역별 설명
5. **데이터 / 표시 필드** — 무엇을 보여주는가
6. **사용자 액션** — 버튼·입력·제스처
7. **API 요구사항** — 엔드포인트 후보 (메서드·경로·요청·응답)
8. **비즈니스 로직 / 정책 이슈** — 백엔드와 합의 필요한 부분
9. **엣지 케이스** — 빈 상태, 에러, 권한 없음 등
