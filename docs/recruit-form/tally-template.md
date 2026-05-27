# Tally 폼 템플릿 (인니어 + 영어)

> 이 문서를 보면서 Tally에 필드를 하나씩 추가하시면 됩니다.
> 각 필드의 한국어 메모는 운영자용 — 폼에는 **인니어/영어만** 노출.
> 모든 라벨은 `Indonesia / English` 형식으로 한 줄에 병기.

---

## Tally 기본 셋팅

폼 만들고 나서 좌측 상단 톱니바퀴(Settings) 들어가서:

| 항목 | 값 |
|---|---|
| Form name | Linka — Pendaftaran Partner |
| Primary color | `#00C853` |
| Background | `#FFFFFF` 또는 `#FAFBFC` |
| Logo | Linka 로고 PNG 업로드 |
| Confirmation message | (아래 "감사 메시지" 섹션 참고) |
| Language | English (UI 기본값. 라벨은 우리가 인니/영어 병기로 직접 작성) |

---

## 폼 구조

총 11개 섹션, 약 5~7분 분량. 섹션 사이는 Tally의 **Page Break** 기능으로 나눠줘야 합니다 (긴 폼을 단계별로 보여주는 효과 + 모바일 가독성 ↑).

| # | 섹션 | 분량 |
|---|---|---|
| 1 | Salam / Welcome | 인트로 |
| 2 | Informasi Dasar / Basic Info | 6 필드 |
| 3 | Pekerjaan / Desired Work | 1 필드 (분기점) |
| 4 | Lokasi & Waktu / Location & Time | 5 필드 |
| 5a | Keterampilan / Skills (헬퍼만) | 1 필드 |
| 5b | Kendaraan / Vehicle (드라이버만) | 4 필드 |
| 6 | Bahasa / Languages | 1 필드 |
| 7 | Tarif / Rate | 1 필드 |
| 8 | Verifikasi / Verification | 2~3 파일 업로드 |
| 9 | Lainnya / Others | 2 필드 |
| 10 | Persetujuan / Consent | 1 체크박스 |
| 11 | Selesai / Done | 감사 메시지 |

---

## 섹션 1 — Salam / Welcome

**필드 타입**: "Question" 아니고 Tally의 "Title" + "Text" 블록 사용 (입력 X, 안내문)

**제목 (Title 블록)**:
```
Selamat datang di Linka!
Welcome to Linka!
```

**본문 (Text 블록)**:
```
Linka adalah aplikasi yang menghubungkan Anda dengan keluarga di Jakarta yang membutuhkan Asisten Rumah Tangga (ART), Sopir, atau Jasa Titip.

Aplikasi kami akan segera diluncurkan, dan kami sedang mencari partner pertama. Daftar sekarang untuk mendapat:
- Akses awal saat aplikasi rilis
- Pelatihan gratis sebelum mulai bekerja
- Pekerjaan tetap dengan keluarga terpercaya di sekitar Anda

Pendaftaran ini gratis. Pengisian sekitar 5–7 menit.

———

Linka is an upcoming app that connects you with families in Jakarta who need helpers, drivers, or errand workers.

Our app will launch soon, and we're recruiting our first partners. Register now to get:
- Early access when the app launches
- Free training before you start working
- Steady work with trusted families near you

Registration is free. Takes about 5–7 minutes.
```

**버튼 (Continue)**:
```
Mulai Pendaftaran  /  Start Registration
```

> 그 다음 **Page Break** 추가.

---

## 섹션 2 — Informasi Dasar / Basic Info

### 필드 1 — 풀네임
- **Type**: Short Answer
- **Label**: `Nama Lengkap (sesuai KTP) / Full Name (as on KTP)`
- **Placeholder**: `Contoh: Sari Dewi Lestari`
- **Required**: ✅
- **운영자 메모**: KTP에 적힌 그대로. 닉네임 X.

### 필드 2 — 생년월일
- **Type**: Date
- **Label**: `Tanggal Lahir / Date of Birth`
- **Required**: ✅

### 필드 3 — 성별
- **Type**: Multiple Choice (single)
- **Label**: `Jenis Kelamin / Gender`
- **Options**:
  - `Wanita / Female`
  - `Pria / Male`
- **Required**: ✅

### 필드 4 — 이메일
- **Type**: Email
- **Label**: `Email`
- **Placeholder**: `nama@email.com`
- **Required**: ✅

### 필드 5 — 전화번호
- **Type**: Phone Number
- **Label**: `Nomor Telepon / Phone Number`
- **Default country**: Indonesia (+62)
- **Required**: ✅

### 필드 6 — WhatsApp 번호
- **Type**: Phone Number
- **Label**: `Nomor WhatsApp / WhatsApp Number`
- **Description (회색 보조 텍스트)**: `Jika sama dengan nomor telepon, isi nomor yang sama. / If same as phone, enter the same number.`
- **Default country**: Indonesia (+62)
- **Required**: ✅
- **운영자 메모**: 인니에서는 메인 소통이 WhatsApp. 별도로 받기.

> 그 다음 **Page Break**.

---

## 섹션 3 — Pekerjaan / Desired Work (분기점)

### 필드 7 — 희망 업무
- **Type**: Multiple Choice (single)
- **Label**: `Layanan yang Anda Inginkan / Service You Want to Provide`
- **Options**:
  - `Asisten Rumah Tangga (ART) / Home Helper`
  - `Sopir / Driver`
  - `Jasa Titip / Errand Worker`
- **Required**: ✅
- **운영자 메모**: 이 답변에 따라 5a(헬퍼) 또는 5b(드라이버)로 분기. 심부름은 둘 다 스킵.

> 그 다음 **Page Break**.

---

## 섹션 4 — Lokasi & Waktu / Location & Time

### 필드 8 — 활동 지역
- **Type**: Dropdown (or Multi-select if 여러 곳 활동 가능)
- **Label**: `Wilayah Aktivitas / Activity Area`
- **Description**: `Pilih wilayah yang Anda bisa jangkau / Select areas you can work in`
- **Options** (Jakarta Selatan + Pusat 위주, 추가 가능):
  - Kebayoran Baru
  - Kemang
  - Pondok Indah
  - Cilandak
  - Pesanggrahan
  - Fatmawati
  - Menteng
  - Kuningan
  - Sudirman
  - SCBD
  - Tebet
  - Mampang
  - Senayan
  - Pondok Pinang
  - Lainnya / Other
- **Required**: ✅

### 필드 9 — 근무 형태
- **Type**: Multiple Choice (single)
- **Label**: `Tipe Pekerjaan / Work Type`
- **Options**:
  - `Berkala (jadwal tetap mingguan) / Regular (fixed weekly schedule)`
  - `Sekali atau jangka pendek / One-time or short-term`
  - `Tinggal di rumah majikan / Live-in`
- **Required**: ✅

### 필드 10 — 가능 요일
- **Type**: Multiple Choice (multi)
- **Label**: `Hari yang Bersedia / Available Days`
- **Options**:
  - `Senin / Mon`
  - `Selasa / Tue`
  - `Rabu / Wed`
  - `Kamis / Thu`
  - `Jumat / Fri`
  - `Sabtu / Sat`
  - `Minggu / Sun`
- **Required**: ✅

### 필드 11 — 가능 시간대
- **Type**: Short Answer
- **Label**: `Jam Kerja yang Bersedia / Working Hours`
- **Placeholder**: `Contoh: 08:00 – 17:00 / Example: 8 AM – 5 PM`
- **Required**: ✅

### 필드 12 — 경력
- **Type**: Multiple Choice (single)
- **Label**: `Pengalaman Kerja / Work Experience`
- **Options**:
  - `Kurang dari 1 tahun / Less than 1 year`
  - `1–3 tahun / 1–3 years`
  - `3–5 tahun / 3–5 years`
  - `Lebih dari 5 tahun / More than 5 years`
- **Required**: ✅

> 그 다음 **Page Break**.

---

## 섹션 5a — Keterampilan / Skills  (헬퍼만 표시)

> **Tally 조건부 로직 셋팅**:
> 이 섹션 페이지 → Settings (좌측) → Logic → "Show this page only if 필드 7 = Asisten Rumah Tangga (ART) / Home Helper"

### 필드 13a — 가능 업무 (헬퍼)
- **Type**: Multiple Choice (multi)
- **Label**: `Keterampilan / Skills`
- **Description**: `Pilih semua yang Anda bisa lakukan / Select all that apply`
- **Options**:
  - `Beberes / Cleaning`
  - `Masak / Cooking`
  - `Cuci & Setrika / Washing & Ironing`
  - `Mengasuh anak / Childcare`
  - `Merawat lansia / Elderly care`
  - `Belanja / Grocery shopping`
  - `Deep cleaning (kaca, AC, dll) / Deep cleaning (windows, AC, etc)`
  - `Lainnya / Other`
- **Required**: ✅

> 페이지 끝에 **Page Break**.

---

## 섹션 5b — Kendaraan & SIM / Vehicle & License  (드라이버만 표시)

> **Tally 조건부 로직 셋팅**:
> 이 섹션 페이지 → Logic → "Show this page only if 필드 7 = Sopir / Driver"

### 필드 13b — 면허 등급
- **Type**: Multiple Choice (single)
- **Label**: `Kelas SIM / Driver's License Class`
- **Options**:
  - `SIM A`
  - `SIM A Umum`
  - `SIM B I`
  - `SIM B II`
- **Required**: ✅

### 필드 13c — 운전 가능 차종
- **Type**: Multiple Choice (multi)
- **Label**: `Tipe Kendaraan yang Bisa Dikemudikan / Vehicle Types You Can Drive`
- **Options**:
  - `Sedan`
  - `SUV`
  - `MPV`
  - `Van`
  - `Truk / Truck`
- **Required**: ✅

### 필드 13d — 본인 차량 보유
- **Type**: Multiple Choice (single)
- **Label**: `Apakah Anda punya kendaraan pribadi? / Do you own a vehicle?`
- **Options**:
  - `Ya / Yes`
  - `Tidak / No`
- **Required**: ✅

### 필드 13e — 드라이버 서비스
- **Type**: Multiple Choice (multi)
- **Label**: `Layanan Sopir yang Bisa Diberikan / Driver Services You Can Provide`
- **Options**:
  - `Sopir Pengganti / Designated Driver`
  - `Harian / Daily`
  - `Per Jam / Hourly`
  - `Antar Jemput Bandara / Airport Transfer`
  - `Komuter / Commute`
  - `Antar Kota / Intercity`
  - `Acara / Event`
- **Required**: ✅

> 페이지 끝에 **Page Break**.

---

## 섹션 6 — Bahasa / Languages

### 필드 14 — 가능 언어
- **Type**: Multiple Choice (multi)
- **Label**: `Bahasa yang Dikuasai / Languages Spoken`
- **Options**:
  - `Bahasa Indonesia` (체크 기본 선택 권장)
  - `English`
  - `한국어 / Korean`
  - `中文 / Mandarin`
  - `Lainnya / Other`
- **Required**: ✅

> 그 다음 **Page Break**.

---

## 섹션 7 — Tarif / Rate

### 필드 15 — 희망 시급
- **Type**: Number
- **Label**: `Tarif Per Jam yang Diharapkan (Rp) / Expected Hourly Rate (Rp)`
- **Description**: `Kosongkan jika bisa dinegosiasikan / Leave blank if negotiable`
- **Placeholder**: `25000`
- **Required**: ❌ (선택)

### 필드 15b — 협의 가능 (선택)
- **Type**: Checkbox (single)
- **Label**: `Bisa dinegosiasikan / Negotiable`
- **Required**: ❌

> 그 다음 **Page Break**.

---

## 섹션 8 — Verifikasi / Verification

### 필드 16 — 얼굴 사진
- **Type**: File Upload
- **Label**: `Foto Wajah / Face Photo`
- **Description**: `Foto wajah jelas, untuk profil. JPG atau PNG. / Clear face photo for your profile. JPG or PNG.`
- **Max files**: 1
- **Allowed types**: JPG, PNG
- **Required**: ✅

### 필드 17 — KTP 사진
- **Type**: File Upload
- **Label**: `Foto KTP / KTP Photo`
- **Description**: `Pastikan semua informasi terbaca dengan jelas. Data Anda aman. / Make sure all info is readable. Your data is safe.`
- **Max files**: 1
- **Required**: ✅

### 필드 18 — SIM 사진 (드라이버만)
- **Type**: File Upload
- **Label**: `Foto SIM / Driver's License Photo`
- **Description**: `Untuk verifikasi sopir. / For driver verification.`
- **Max files**: 1
- **Required**: ✅
- **Logic**: 필드 7 = Sopir / Driver 일 때만 표시

> 그 다음 **Page Break**.

---

## 섹션 9 — Lainnya / Others

### 필드 19 — 유입 경로
- **Type**: Multiple Choice (single)
- **Label**: `Bagaimana Anda Tahu Tentang Linka? / How did you hear about Linka?`
- **Options**:
  - `Teman / Friend`
  - `Media Sosial (Instagram, TikTok, Facebook) / Social Media`
  - `WhatsApp Group`
  - `Iklan / Ads`
  - `Komunitas / Community`
  - `Lainnya / Other`
- **Required**: ❌

### 필드 20 — 자기소개
- **Type**: Long Answer
- **Label**: `Pesan Tambahan / Additional Message`
- **Description**: `Ceritakan tentang diri Anda secara singkat (opsional) / Tell us briefly about yourself (optional)`
- **Required**: ❌
- **Max characters**: 500

> 그 다음 **Page Break**.

---

## 섹션 10 — Persetujuan / Consent

### 필드 21 — 개인정보 동의
- **Type**: Checkbox (single, must be checked)
- **Label**:
```
Saya setuju dengan pengumpulan dan penggunaan data pribadi saya untuk proses pendaftaran dan verifikasi Linka. Data Anda tidak akan dibagikan ke pihak ketiga tanpa izin.

I consent to the collection and use of my personal data for Linka registration and verification. Your data will not be shared with third parties without permission.
```
- **Required**: ✅
- **운영자 메모**: 인니 PDP법(2024년 발효) 준수 항목. 빠지면 안 됨.

---

## 섹션 11 — Selesai / Done (감사 메시지)

폼 Settings → Confirmation page에서 설정.

```
Terima kasih telah mendaftar di Linka! 🌿

Tim kami akan menghubungi Anda dalam 3–5 hari kerja melalui WhatsApp untuk:
- Verifikasi data
- Wawancara singkat
- Penjadwalan pelatihan

Sampai jumpa segera!

———

Thank you for registering with Linka!

Our team will contact you via WhatsApp within 3–5 business days for:
- Data verification
- Short interview
- Training schedule

See you soon!
```

---

## 조건부 로직 (Logic) 정리

Tally 좌측 메뉴 → Logic → 다음 3개 규칙 추가:

1. **헬퍼 분기**:
   - "Show page Section 5a if 필드 7 = Asisten Rumah Tangga (ART) / Home Helper"

2. **드라이버 분기**:
   - "Show page Section 5b if 필드 7 = Sopir / Driver"
   - "Show 필드 18 (SIM 사진) if 필드 7 = Sopir / Driver"

3. **자동 스킵**:
   - 심부름(Jasa Titip) 선택 시 5a·5b 둘 다 안 보이고 바로 섹션 6으로

---

## 알림 셋팅 (운영자가 응답 받자마자 알 수 있게)

Tally → Settings → Notifications:

- **Email notification**: 본인 이메일 등록 → 응답 들어올 때마다 메일
- **Webhook (선택)**: Slack 채널이 있으면 거기로 알림 가능

---

## 모바일 미리보기 체크리스트

폼 만든 후 본인 폰으로 입력 테스트:

- [ ] 인니어 텍스트가 잘려보이지 않는가
- [ ] 페이지 이동이 부드러운가 (긴 폼 한 장에 다 X)
- [ ] 파일 업로드가 폰 카메라에서 바로 되는가 (KTP·얼굴)
- [ ] 헬퍼 선택 후 드라이버 섹션이 안 나타나는가
- [ ] 진행률 막대(progress bar)가 표시되는가
- [ ] 제출 버튼이 모바일에서 잘 눌리는가

---

## 운영자(한국) 응답 처리 흐름

[admin-guide.md](./admin-guide.md) 참고.
