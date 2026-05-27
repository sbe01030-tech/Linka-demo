# Vercel 랜딩 페이지 카피 (linka.id/daftar)

> Tally 폼을 embed할 1-페이지 랜딩.
> 다음 주 Vercel 셋업 시 사용. 지금 단계에선 Tally 단독 URL만 써도 OK.

---

## 페이지 구조

```
┌─────────────────────────────────┐
│  [Linka 로고]                    │
│                                  │
│  헤드라인 (인니어, 큰 글씨)       │
│  서브텍스트 (인니어/영어)         │
│                                  │
│  [3-step 안내]                   │
│   1. Daftar  2. Verifikasi  3. Mulai │
│                                  │
│  [Tally 폼 embed]                │
│                                  │
│  [WhatsApp 문의 버튼]            │
│  [개인정보 안내]                  │
│                                  │
│  © 2026 Linka                    │
└─────────────────────────────────┘
```

---

## 카피 (인니어 + 영어)

### 헤드라인

**인니어 (메인)**
```
Bergabunglah dengan Linka.
Kerja Anda, dipercaya keluarga di Jakarta.
```

**영어 (서브)**
```
Join Linka.
Your work, trusted by families in Jakarta.
```

---

### 서브텍스트 (인트로)

**인니어**
```
Linka adalah aplikasi yang menghubungkan Anda dengan keluarga
yang membutuhkan bantuan: Asisten Rumah Tangga, Sopir, atau Jasa Titip.
Aplikasi kami akan segera diluncurkan — daftar sekarang untuk akses awal.
```

**영어**
```
Linka is an upcoming app that connects you with families
who need helpers, drivers, or errand workers.
Register now for early access when we launch.
```

---

### 3-step 안내 (가입자가 뭘 기대할지)

| 단계 | 인니어 | 영어 |
|---|---|---|
| 1 | **Daftar** — Isi formulir 5 menit | **Register** — Fill the 5-minute form |
| 2 | **Verifikasi** — Tim kami hubungi via WhatsApp | **Verify** — Our team contacts you via WhatsApp |
| 3 | **Mulai Kerja** — Bertemu keluarga di sekitar Anda | **Start Working** — Meet families near you |

---

### CTA 버튼 (폼 위에)

```
Mulai Pendaftaran  /  Start Registration
```
또는 폼이 바로 임베드되어 있으면 버튼 없이 폼이 자연스럽게 첫 화면.

---

### WhatsApp 문의 버튼 (폼 아래)

**인니어**
```
Ada pertanyaan? Hubungi kami via WhatsApp
```
**영어**
```
Questions? Contact us on WhatsApp
```

→ `https://wa.me/62XXXXXXXXXX` 링크로 연결.

---

### 개인정보 안내 (폼 아래 작게)

**인니어**
```
Data Anda aman. Kami hanya menggunakan informasi pendaftaran
untuk proses verifikasi dan pencocokan pekerjaan.
```
**영어**
```
Your data is safe. We use registration info only for
verification and job matching.
```

---

### 푸터

```
© 2026 Linka  ·  PT [회사명]  ·  Jakarta, Indonesia
```

---

## 디자인 가이드

| 항목 | 값 |
|---|---|
| Primary color | `#00C853` (Linka 그린) |
| Background | 흰색 또는 `#FAFBFC` |
| Heading font | Nunito_900Black (앱과 동일) 또는 Inter Bold |
| Body font | Inter Regular / Pretendard / Plus Jakarta Sans |
| 모바일 우선 | 폰 가로폭 360–390px 기준 디자인 |
| 로딩 속도 | 2초 이내 (Vercel 기본 충족) |

---

## 도메인

| 옵션 | 비용 | 비고 |
|---|---|---|
| `linka.id/daftar` | `.id` 도메인 보유 시 | 신뢰감 ↑ |
| `linka.tally.so` | 무료 (Tally 기본) | 빠르게 시작 가능 |
| `forms.linka.com` 등 서브도메인 | 도메인 보유 시 무료 | Vercel CNAME 셋업 |

지금 단계에선 **Tally 기본 URL** 써도 충분. 도메인은 백엔드 외주가 셋업할 때 같이 처리.

---

## Vercel 배포 (다음 주)

1. Next.js 또는 Vite + React로 1-페이지 사이트 만들기
2. Tally 폼 embed:
   ```html
   <iframe src="https://tally.so/embed/YOUR_FORM_ID" width="100%" height="600" frameborder="0"></iframe>
   ```
3. GitHub repo 만들고 → Vercel에 import → 자동 배포
4. 도메인 연결

> 이건 본인이 어드민 웹 만드는 외주에게 같이 부탁해도 좋아요. 1-페이지라 1~2일이면 됩니다.
