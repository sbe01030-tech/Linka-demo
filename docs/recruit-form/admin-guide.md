# 운영자 응답 처리 가이드 (한국어)

> Tally 폼으로 들어오는 응답을 한국 측에서 어떻게 검토·관리할지.

---

## 응답 도착 알림

설정해두면:
1. 응답 들어올 때마다 본인 이메일로 알림 도착
2. Google Sheets에 자동 행 추가
3. (선택) Slack 채널에 webhook 알림

---

## Google Sheets 컬럼 구성

자동 생성되는 시트의 첫 행은 폼 필드명. 운영용으로 다음 컬럼 **수동 추가** 권장:

| 컬럼 | 값 | 입력자 |
|---|---|---|
| **Status** | `신규 / 검토중 / 면접완료 / 승인 / 보류 / 거절` | 운영자 |
| **검토 메모** | 자유 | 운영자 |
| **WhatsApp 발송일** | YYYY-MM-DD | 운영자 |
| **면접 일정** | YYYY-MM-DD | 운영자 |
| **현지 파트너 담당자** | 이름 | 운영자 |
| **승인 일자** | YYYY-MM-DD | 운영자 |

---

## 응답 처리 SLA

| 응답 후 | 액션 |
|---|---|
| 1일 이내 | Status: 신규 → 검토중 변경 |
| 3일 이내 | WhatsApp으로 첫 연락 (확인 메시지) |
| 7일 이내 | 면접 일정 잡기 또는 보류/거절 결정 |

---

## WhatsApp 첫 연락 메시지 템플릿

### 인니어
```
Halo {이름}, terima kasih telah mendaftar di Linka!

Saya {담당자명} dari tim Linka. Kami sudah menerima pendaftaran Anda
sebagai {ART/Sopir/Jasa Titip} di area {지역}.

Untuk verifikasi, kami ingin mengatur wawancara singkat (15 menit)
dalam beberapa hari ke depan. Kapan waktu yang nyaman untuk Anda?

Terima kasih!
```

### 영어 (백업)
```
Hello {name}, thank you for registering with Linka!

I'm {staff name} from the Linka team. We've received your application
as {Helper/Driver/Errand} in {area}.

For verification, we'd like to schedule a short interview (15 min)
in the next few days. When would be a good time for you?

Thank you!
```

---

## 검증 체크리스트 (면접 전)

| 항목 | 확인 |
|---|---|
| KTP 사진과 이름 일치 | ☐ |
| KTP 사진 선명도 (모든 정보 읽힘) | ☐ |
| 얼굴 사진과 KTP 사진 동일인 추정 | ☐ |
| (드라이버) SIM 사진 등급 일치 | ☐ |
| 전화번호·WhatsApp 정상 연결 확인 | ☐ |
| 활동 지역과 KTP 주소 합리적 거리 | ☐ |
| 동일인 중복 가입 (이메일·전화번호) | ☐ |

---

## 거절 사유 분류 (운영자 통계용)

- 정보 불충분 (KTP 흐림 등)
- 활동 지역 미지원
- 면접 응답 없음
- 검증 실패 (신분 불일치)
- 본인 의사 철회

---

## 데이터 보안 메모

- KTP·SIM·얼굴 사진은 **민감 정보**. Google Drive 폴더 권한 관리 필수.
- 한국·인도네시아 운영자 외 접근 금지.
- 거절·철회된 응답은 **6개월 후 삭제** 정책 권장 (인니 PDP법 기준).

---

## 백엔드 마이그레이션 시점

응답 50건 또는 베타 출시 1개월 전 중 빠른 시점 → 본격적인 백엔드 DB로 옮기기.

마이그레이션 시 운영자 측에서 백엔드 외주에 전달할 것:
- Google Sheet 다운로드 (CSV)
- KTP/얼굴 사진 폴더 (Drive 링크 또는 zip)
- 컬럼 매핑 표 (Tally 필드 → DB 컬럼)
