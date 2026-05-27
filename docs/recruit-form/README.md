# Linka 파트너 모집 폼 (Tally)

> 인도네시아 현지 헬퍼·드라이버·심부름꾼 사전 등록용 웹 폼.
> 베타 출시 전 단계, 백엔드 없이 운영. 데이터는 Google Sheets로 자동 수집.

---

## 흐름

```
워커 (인도네시아)
   ↓ 모바일 브라우저로 접속
linka.id/daftar  (또는 forms.linka.id 등 커스텀 도메인)
   ↓ Vercel 1-페이지 랜딩 (Linka 로고 + 짧은 소개)
   ↓ 페이지 안에 Tally 폼 embed
   ↓ 워커가 폼 작성 완료
Google Sheets 자동 누적  →  운영자가 검토 → WhatsApp으로 면접 안내
```

---

## 파일 구성

- `README.md` — 이 문서 (전체 가이드)
- `tally-template.md` — Tally 폼 셋업 + 모든 필드 인니어/영어 텍스트
- `landing-copy.md` — Vercel 랜딩 페이지에 들어갈 인니어/영어 카피
- `admin-guide.md` — 운영자(한국 측) 응답 처리 가이드

---

## 셋업 순서 (3단계)

### 1단계 — Tally 폼 만들기 (오늘, 1시간)
1. https://tally.so 가입 (무료)
2. New form → Blank form 선택
3. [tally-template.md](./tally-template.md) 보면서 필드 하나씩 추가
4. 색상·로고 설정: Form Settings → Branding
   - Primary color: `#00C853` (Linka 그린)
   - Logo 업로드 (로고 이미지 있으면)
5. 미리보기 → 모바일에서 입력 테스트
6. Publish → 공유 링크 복사

### 2단계 — Google Sheets 연동 (10분)
1. Tally 폼 → Integrations → Google Sheets
2. 본인 구글 계정 연결 → 스프레드시트 자동 생성
3. 응답 들어올 때마다 자동 추가됨

### 3단계 — 랜딩 페이지 (다음 주)
- Vercel에 1-페이지 사이트 만들기 (별도 작업)
- 그 안에 Tally 폼 embed
- 또는 Tally에서 제공하는 커스텀 URL 그대로 써도 OK

---

## 필요한 것

| 항목 | 상태 | 메모 |
|---|---|---|
| Linka 로고 이미지 (PNG, 흰배경 또는 투명) | 확인 필요 | 폼 헤더에 사용 |
| 인도네시아어 회사 소개 1-2문장 | [landing-copy.md](./landing-copy.md) 참고 |
| 활동 지역 (자카르타 동네) 리스트 | 본 가이드에 포함 |
| 워커 응답 받을 이메일 (운영자) | Tally에서 알림 받기용 |
| 공식 WhatsApp 번호 | 폼 안내 메시지에 노출 |

---

## 다음 단계 (현재 폼 운영 후)

- 응답 50건 모이면 → 패턴 분석 (어떤 지역 워커가 많은지, 평균 시급 등)
- 백엔드 준비되면 → Tally 데이터를 실제 DB로 마이그레이션
- 앱 출시 시 → 사전 등록자에게 WhatsApp으로 다운로드 링크 발송
