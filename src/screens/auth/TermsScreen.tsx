/**
 * TermsScreen
 * mode='agree' — registration flow (checkboxes + CTA)
 * mode='view'  — profile tab (read-only)
 *
 * Each consent item has full legal text displayed in a
 * scrollable bottom-sheet modal — legally meaningful, not just an Alert.
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Animated,
  Dimensions, Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../constants/colors';
import { RootStackParamList } from '../../types';
import { useLanguageStore } from '../../store/languageStore';
import { LangCode } from '../../i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

const { height: SH } = Dimensions.get('window');

// ── Full legal document texts ─────────────────────────────────────

type DocKey = 'service' | 'privacy' | 'thirdparty' | 'marketing';

type LegalDoc = { title: string; body: string };
type TermsContent = {
  pageTitle: string;
  overviewTitle: string;
  overviewBody: string;
  policy1Title: string;
  policy1Body: string;
  policy2Title: string;
  policy2Body: string;
  agreeAll: string;
  items: { label: string; required: boolean; docKey: DocKey | null }[];
  ctaAgree: string;
  ctaClose: string;
  docs: Record<DocKey, LegalDoc>;
};

const CONTENT: Record<LangCode, TermsContent> = {
  /* ──────────────── BAHASA INDONESIA ──────────────── */
  id: {
    pageTitle: 'Syarat & Ketentuan',
    overviewTitle: 'Ringkasan Kebijakan Layanan Linka',
    overviewBody:
      'Linka adalah platform teknologi yang menghubungkan pelanggan dengan Asisten Rumah Tangga (ART) atau guru les independen. PT Linka Indonesia bertindak semata-mata sebagai perantara dan tidak bertanggung jawab atas hasil, kualitas, atau perselisihan yang timbul dari transaksi antara pengguna dan mitra.',
    policy1Title: 'Kebijakan Operasional Linka',
    policy1Body:
      'Aplikasi Linka adalah platform yang menyediakan informasi untuk menghubungkan pengguna (pelanggan) dengan helper (asisten rumah tangga atau guru les) sehingga mereka dapat saling menemukan dan menghubungi. PT Linka Indonesia (selanjutnya disebut "Perusahaan") hanya bertindak sebagai perantara dalam pengenalan dan pencocokan antara pelanggan dan helper, bukan sebagai agen tenaga kerja, perusahaan penyalur, maupun perusahaan yang mempekerjakan helper. Perusahaan tidak bertanggung jawab atas segala permasalahan yang timbul di antara pelanggan dan helper.',
    policy2Title: 'Kewajiban Anggota Linka',
    policy2Body:
      'Anggota wajib memilih helper atau pelanggan yang sesuai dengan kebutuhan mereka secara mandiri, dan melaksanakan seluruh kegiatan dengan jujur dan penuh tanggung jawab sesuai kondisi kontrak yang telah disepakati bersama atau peraturan perundang-undangan yang berlaku. Apabila salah satu pihak memberitahukan pemutusan kontrak secara sepihak tanpa koordinasi terlebih dahulu, sanksi dapat dikenakan sesuai Ketentuan Layanan yang berlaku.',
    agreeAll: 'Setujui semua syarat & ketentuan',
    items: [
      { label: '(Wajib) Persetujuan Kebijakan Operasional & Kewajiban Anggota', required: true,  docKey: null        },
      { label: '(Wajib) Syarat & Ketentuan Penggunaan',              required: true,  docKey: 'service'    },
      { label: '(Wajib) Kebijakan Privasi & Penggunaan Data Pribadi', required: true,  docKey: 'privacy'    },
      { label: '(Wajib) Persetujuan Berbagi Data kepada Pihak Ketiga', required: true,  docKey: 'thirdparty' },
      { label: '(Opsional) Terima notifikasi promo & komunitas',      required: false, docKey: 'marketing'  },
    ],
    ctaAgree: 'Setuju & Lanjutkan',
    ctaClose: 'Tutup',
    docs: {
      service: {
        title: 'Syarat & Ketentuan Penggunaan Linka',
        body: `Terakhir diperbarui: April 2025

1. DEFINISI DAN STATUS PLATFORM

1.1 PT Linka Indonesia ("Linka", "Kami") mengoperasikan platform digital yang semata-mata berfungsi sebagai perantara untuk mempertemukan pengguna jasa ("Pelanggan") dengan penyedia jasa independen ("Mitra").

1.2 Linka BUKAN agen tenaga kerja, perusahaan penyalur tenaga kerja, maupun badan usaha yang mempekerjakan Mitra. Mitra adalah pekerja lepas (freelancer) independen yang menawarkan jasa atas nama dan tanggung jawab mereka sendiri.

1.3 Linka tidak memiliki kendali atas cara Mitra melaksanakan pekerjaan, standar kualitas, atau kepatuhan terhadap hukum ketenagakerjaan yang berlaku.

2. PEMBATASAN TANGGUNG JAWAB PLATFORM

2.1 Linka tidak bertanggung jawab atas:
   • Kerugian, kerusakan, atau kehilangan properti yang terjadi selama atau setelah pelaksanaan jasa oleh Mitra;
   • Cedera fisik, kecelakaan, atau insiden yang melibatkan Pelanggan, Mitra, atau pihak ketiga;
   • Kualitas, ketepatan waktu, atau hasil akhir dari jasa yang diberikan Mitra;
   • Perselisihan, sengketa, atau pelanggaran kontrak antara Pelanggan dan Mitra;
   • Kerugian tidak langsung, insidental, atau konsekuensial apapun yang timbul dari penggunaan platform.

2.2 Batas maksimum ganti rugi yang dapat diklaim kepada Linka dalam kondisi apapun tidak melebihi nilai transaksi yang dipersengketakan.

3. KEWAJIBAN DAN TANGGUNG JAWAB PELANGGAN

3.1 Pelanggan bertanggung jawab penuh untuk:
   • Memverifikasi identitas, kompetensi, dan rekam jejak Mitra sebelum menyepakati perjanjian kerja;
   • Mengamankan barang-barang berharga, dokumen sensitif, dan akses properti selama Mitra bekerja;
   • Menyediakan lingkungan kerja yang aman, layak, dan sesuai peraturan perundang-undangan;
   • Membayar imbalan jasa sesuai dengan yang disepakati tanpa penundaan atau pengurangan sepihak.

3.2 Pelanggan dilarang keras:
   • Menggunakan platform untuk tujuan ilegal atau merugikan pihak lain;
   • Memberikan informasi palsu atau menyesatkan kepada Mitra maupun Linka;
   • Melakukan pelecehan, diskriminasi, atau tindakan tidak pantas terhadap Mitra.

4. PEMBATALAN DAN SANKSI

4.1 Pembatalan oleh Pelanggan kurang dari 24 jam sebelum waktu layanan dapat dikenakan biaya pembatalan.

4.2 Pelanggaran terhadap ketentuan ini dapat mengakibatkan penangguhan atau penonaktifan akun secara permanen tanpa kompensasi.

5. PENYELESAIAN SENGKETA

5.1 Setiap sengketa diselesaikan melalui mediasi terlebih dahulu. Apabila gagal, diselesaikan melalui Pengadilan Negeri Jakarta Selatan sesuai hukum Republik Indonesia.

5.2 Linka tidak wajib menjadi pihak dalam sengketa antara Pelanggan dan Mitra.

6. PERUBAHAN KETENTUAN

Linka berhak mengubah ketentuan ini sewaktu-waktu. Perubahan material akan diberitahukan melalui aplikasi minimal 7 hari sebelum berlaku.`,
      },
      privacy: {
        title: 'Kebijakan Privasi & Penggunaan Data Pribadi',
        body: `Terakhir diperbarui: April 2025

1. DATA YANG KAMI KUMPULKAN

1.1 Data yang Anda berikan secara langsung:
   • Nama lengkap, nomor telepon, kata sandi;
   • Foto profil dan foto dokumen verifikasi;
   • Alamat lokasi layanan;
   • Riwayat transaksi dan ulasan.

1.2 Data yang dikumpulkan secara otomatis:
   • Data perangkat (model, OS, ID perangkat);
   • Data lokasi GPS (hanya saat aplikasi aktif);
   • Log aktivitas penggunaan aplikasi.

2. TUJUAN PENGGUNAAN DATA

Kami menggunakan data Anda untuk:
   • Menyediakan dan meningkatkan layanan platform;
   • Memverifikasi identitas dan mencegah penipuan;
   • Menghubungkan Pelanggan dengan Mitra yang sesuai;
   • Mengirimkan notifikasi layanan dan pembaruan akun;
   • Memenuhi kewajiban hukum dan regulasi yang berlaku.

3. KEAMANAN DATA

3.1 Data Anda disimpan di server yang terenkripsi dengan standar keamanan industri.

3.2 Kami tidak akan menjual data pribadi Anda kepada pihak ketiga untuk kepentingan komersial tanpa persetujuan Anda.

4. HAK ANDA

Anda berhak untuk:
   • Mengakses dan memperbarui data pribadi Anda kapan saja;
   • Meminta penghapusan akun dan data pribadi;
   • Mencabut persetujuan penggunaan data dengan menghapus akun.

5. KONTAK

Pertanyaan terkait privasi: privacy@linka.id`,
      },
      thirdparty: {
        title: 'Persetujuan Berbagi Data kepada Pihak Ketiga',
        body: `Terakhir diperbarui: April 2025

1. PIHAK KETIGA YANG MENERIMA DATA

Untuk menjalankan layanan, Linka dapat berbagi data Anda yang diperlukan dengan:
   • Penyedia layanan pembayaran (untuk memproses transaksi);
   • Mitra logistik dan verifikasi identitas;
   • Layanan analitik dan peningkatan produk (Google Analytics, Firebase);
   • Lembaga pemerintah jika diwajibkan oleh hukum.

2. BATASAN BERBAGI DATA

2.1 Kami hanya berbagi data yang diperlukan untuk tujuan spesifik tersebut.

2.2 Semua pihak ketiga yang menerima data diwajibkan untuk menjaga kerahasiaan dan keamanan data sesuai standar yang kami terapkan.

2.3 Kami tidak menjual data identitas pribadi Anda (nama, nomor telepon) kepada pengiklan atau pihak komersial manapun.

3. TRANSFER DATA INTERNASIONAL

Beberapa layanan pihak ketiga dapat memproses data di luar Indonesia. Kami memastikan perlindungan yang setara diterapkan.

4. PENCABUTAN PERSETUJUAN

Anda dapat mencabut persetujuan ini dengan menghapus akun Anda. Pencabutan tidak mempengaruhi pemrosesan data yang telah dilakukan sebelumnya.`,
      },
      marketing: {
        title: 'Notifikasi Promo & Komunitas (Opsional)',
        body: `Terakhir diperbarui: April 2025

Dengan menyetujui ini, Anda bersedia menerima:
   • Informasi promo, diskon, dan penawaran spesial dari Linka;
   • Pengumuman event dan program komunitas;
   • Tips penggunaan layanan dan konten edukasi;
   • Survei kepuasan pengguna.

Notifikasi dikirimkan melalui:
   • Push notification aplikasi;
   • WhatsApp / SMS ke nomor terdaftar;
   • Email (jika terdaftar).

Anda dapat berhenti menerima notifikasi ini kapan saja melalui Pengaturan → Notifikasi di dalam aplikasi, atau dengan menghubungi tim kami.

Persetujuan ini bersifat opsional dan tidak mempengaruhi akses Anda ke layanan utama Linka.`,
      },
    },
  },

  /* ──────────────── ENGLISH ──────────────── */
  en: {
    pageTitle: 'Terms & Conditions',
    overviewTitle: 'Linka Service Policy Overview',
    overviewBody:
      'Linka is a technology platform that connects customers with independent home assistants (ART) or tutors. PT Linka Indonesia acts solely as an intermediary and is not responsible for the outcome, quality, or disputes arising from transactions between users and partners.',
    policy1Title: 'Linka Service Policy',
    policy1Body:
      'The Linka app is a platform that provides information to connect users (customers) with helpers (home assistants or tutors), enabling them to find and contact each other. PT Linka Indonesia (the "Company") acts solely as an intermediary that introduces and matches customers with helpers. The Company is not a staffing agency, labour dispatch firm, or employer of helpers. The Company bears no responsibility for any issues arising between customers and helpers.',
    policy2Title: 'Member Obligations',
    policy2Body:
      'Members must independently select suitable helpers or customers, and carry out all activities honestly and responsibly in accordance with mutually agreed contract terms or applicable laws. If either party notifies the other of contract termination unilaterally without prior coordination, penalties may be imposed in accordance with the Terms of Service.',
    agreeAll: 'Agree to all terms & conditions',
    items: [
      { label: '(Required) Agree to Service Policy & Member Obligations', required: true,  docKey: null        },
      { label: '(Required) Terms of Service',                       required: true,  docKey: 'service'    },
      { label: '(Required) Privacy Policy & Personal Data Use',     required: true,  docKey: 'privacy'    },
      { label: '(Required) Consent to Share Data with Third Parties', required: true,  docKey: 'thirdparty' },
      { label: '(Optional) Receive promo & community notifications', required: false, docKey: 'marketing'  },
    ],
    ctaAgree: 'Agree & Continue',
    ctaClose: 'Close',
    docs: {
      service: {
        title: 'Linka Terms of Service',
        body: `Last updated: April 2025

1. DEFINITIONS AND PLATFORM STATUS

1.1 PT Linka Indonesia ("Linka", "We") operates a digital platform that functions solely as an intermediary connecting service users ("Customers") with independent service providers ("Partners").

1.2 Linka is NOT a staffing agency, labour dispatch company, or employer of Partners. Partners are independent freelancers who offer services on their own behalf and at their own responsibility.

1.3 Linka has no control over how Partners perform their work, the quality of their service, or their compliance with applicable employment laws.

2. LIMITATION OF PLATFORM LIABILITY

2.1 Linka is not liable for:
   • Loss, damage, or theft of property occurring during or after service by a Partner;
   • Physical injury, accidents, or incidents involving Customers, Partners, or third parties;
   • Quality, timeliness, or outcome of services provided by Partners;
   • Disputes, disagreements, or breach of contract between Customers and Partners;
   • Any indirect, incidental, or consequential losses arising from use of the platform.

2.2 The maximum liability that may be claimed against Linka under any circumstances shall not exceed the value of the disputed transaction.

3. CUSTOMER OBLIGATIONS AND RESPONSIBILITIES

3.1 Customers are fully responsible for:
   • Verifying the identity, competence, and background of a Partner before agreeing to a service engagement;
   • Securing valuables, sensitive documents, and property access while a Partner is working;
   • Providing a safe and lawful working environment;
   • Paying agreed service fees without unilateral delay or deduction.

3.2 Customers are strictly prohibited from:
   • Using the platform for illegal or harmful purposes;
   • Providing false or misleading information to Partners or Linka;
   • Harassing, discriminating against, or otherwise mistreating Partners.

4. CANCELLATION AND SANCTIONS

4.1 Customer cancellations made less than 24 hours before the scheduled service time may incur a cancellation fee.

4.2 Violation of these terms may result in account suspension or permanent deactivation without compensation.

5. DISPUTE RESOLUTION

5.1 Disputes are first subject to mediation. If unresolved, they shall be settled in the South Jakarta District Court under the laws of the Republic of Indonesia.

5.2 Linka is not obligated to be a party in disputes between Customers and Partners.

6. CHANGES TO TERMS

Linka reserves the right to update these terms at any time. Material changes will be communicated in-app at least 7 days before taking effect.`,
      },
      privacy: {
        title: 'Privacy Policy & Personal Data Use',
        body: `Last updated: April 2025

1. DATA WE COLLECT

1.1 Data you provide directly:
   • Full name, phone number, password;
   • Profile photo and verification document photos;
   • Service address and location;
   • Transaction history and reviews.

1.2 Data collected automatically:
   • Device data (model, OS, device ID);
   • GPS location data (only while the app is active);
   • App usage activity logs.

2. PURPOSES OF DATA USE

We use your data to:
   • Provide and improve our platform services;
   • Verify identity and prevent fraud;
   • Match Customers with suitable Partners;
   • Send service notifications and account updates;
   • Comply with applicable legal and regulatory obligations.

3. DATA SECURITY

3.1 Your data is stored on servers encrypted to industry-standard security.

3.2 We will not sell your personal data to third parties for commercial purposes without your consent.

4. YOUR RIGHTS

You have the right to:
   • Access and update your personal data at any time;
   • Request deletion of your account and personal data;
   • Withdraw data consent by deleting your account.

5. CONTACT

Privacy questions: privacy@linka.id`,
      },
      thirdparty: {
        title: 'Consent to Share Data with Third Parties',
        body: `Last updated: April 2025

1. THIRD PARTIES RECEIVING DATA

To operate our service, Linka may share necessary data with:
   • Payment service providers (to process transactions);
   • Logistics and identity verification partners;
   • Analytics and product improvement services (Google Analytics, Firebase);
   • Government authorities where required by law.

2. DATA SHARING LIMITS

2.1 We only share the minimum data necessary for each specific purpose.

2.2 All third parties receiving data are required to maintain confidentiality and security standards equivalent to our own.

2.3 We do not sell your personal identifying information (name, phone number) to any advertiser or commercial party.

3. INTERNATIONAL DATA TRANSFER

Some third-party services may process data outside Indonesia. We ensure equivalent protections are applied.

4. WITHDRAWING CONSENT

You may withdraw consent by deleting your account. Withdrawal does not affect data already processed.`,
      },
      marketing: {
        title: 'Promo & Community Notifications (Optional)',
        body: `Last updated: April 2025

By agreeing, you consent to receive:
   • Promotional offers, discounts, and special deals from Linka;
   • Community event and programme announcements;
   • Service tips and educational content;
   • User satisfaction surveys.

Notifications are sent via:
   • In-app push notifications;
   • WhatsApp / SMS to your registered number;
   • Email (if registered).

You may unsubscribe at any time via Settings → Notifications in the app, or by contacting our team.

This consent is optional and does not affect your access to core Linka services.`,
      },
    },
  },

  /* ──────────────── 한국어 ──────────────── */
  ko: {
    pageTitle: '서비스 이용 동의',
    overviewTitle: 'Linka 서비스 정책 요약',
    overviewBody:
      'Linka는 고객과 독립 가사도우미(ART) 또는 과외선생님을 연결하는 기술 플랫폼입니다. PT Linka Indonesia는 순수 중개자로서 역할하며, 사용자와 파트너 간 거래에서 발생하는 결과·품질·분쟁에 대해 책임을 지지 않습니다.',
    policy1Title: 'Linka 앱 서비스 운영정책',
    policy1Body:
      'Linka 앱은 맘시터(시터회원) 또는 일자리(부모회원)를 찾고 연락할 수 있도록 정보를 제공하는 구인구직 플랫폼입니다. 본 서비스에 가입한 Linka(헬퍼회원)는 (주)링카인도네시아의 직원이 아니며, (주)링카인도네시아는 고객과 도우미 간의 계약 소개·알선만 하고, 일반 파견업이 아닙니다. (주)링카인도네시아는 고객과 도우미 간에 발생하는 모든 문제에 대한 책임이 없음을 알려드립니다.',
    policy2Title: 'Linka 앱 회원의 의무',
    policy2Body:
      '회원은 자신에게 적합한 헬퍼(도우미) 또는 고객(이용자)을 선택하고, 서로 합의한 계약 조건이나 관련 법에 의거하여 성실히 활동해야 합니다. 상호 합의한 내용을 사전 조율 없이 일방적으로 해지 통보할 경우, 서비스이용약관에 따라 강제 탈퇴될 수 있습니다.',
    agreeAll: '약관 전체 동의',
    items: [
      { label: '(필수) 서비스 운영정책 및 회원의 의무 동의', required: true,  docKey: null        },
      { label: '(필수) 서비스 이용약관 동의',               required: true,  docKey: 'service'    },
      { label: '(필수) 개인정보 수집 및 이용에 관한 동의',   required: true,  docKey: 'privacy'    },
      { label: '(필수) 개인정보 제3자 제공에 관한 동의',     required: true,  docKey: 'thirdparty' },
      { label: '(선택)이벤트·혜택 및 커뮤니티 알림 수신',   required: false, docKey: 'marketing'  },
    ],
    ctaAgree: '동의 후 계속',
    ctaClose: '닫기',
    docs: {
      service: {
        title: 'Linka 서비스 이용약관',
        body: `최종 업데이트: 2025년 4월

1. 정의 및 플랫폼 지위

1.1 PT Linka Indonesia("Linka", "당사")는 서비스 이용자("고객")와 독립 서비스 제공자("파트너")를 연결하는 중개 플랫폼을 운영합니다.

1.2 Linka는 인력 파견업체, 채용 대행사, 또는 파트너의 고용주가 아닙니다. 파트너는 독립적인 개인사업자로서 자신의 이름과 책임 하에 서비스를 제공합니다.

1.3 Linka는 파트너의 업무 수행 방식, 서비스 품질 또는 관련 법령 준수 여부에 대해 통제권이 없습니다.

2. 플랫폼 책임 제한

2.1 Linka는 다음에 대해 책임을 지지 않습니다:
   • 파트너의 서비스 수행 중 또는 이후 발생한 재산 피해, 손실 또는 도난;
   • 고객, 파트너 또는 제3자가 관련된 신체적 상해, 사고 또는 사건;
   • 파트너가 제공하는 서비스의 품질, 적시성 또는 결과;
   • 고객과 파트너 간의 분쟁, 불화 또는 계약 위반;
   • 플랫폼 이용으로 인해 발생하는 간접적, 우발적 또는 결과적 손실.

2.2 어떠한 경우에도 Linka에 대해 청구할 수 있는 최대 배상액은 분쟁 대상 거래 금액을 초과할 수 없습니다.

3. 고객의 의무 및 책임

3.1 고객은 다음에 대해 전적으로 책임을 집니다:
   • 서비스 계약 전 파트너의 신원, 역량 및 이력 확인;
   • 파트너 근무 중 귀중품, 민감 서류 및 자산 접근 보호;
   • 안전하고 적법한 작업 환경 제공;
   • 일방적 지연 또는 감액 없이 약정된 서비스 비용 지급.

3.2 고객은 다음 행위가 엄격히 금지됩니다:
   • 불법적이거나 타인에게 해를 끼치는 목적으로 플랫폼 이용;
   • 파트너 또는 Linka에 허위 또는 오해를 불러일으키는 정보 제공;
   • 파트너에 대한 괴롭힘, 차별 또는 부적절한 행위.

4. 취소 및 제재

4.1 예약 24시간 이내 고객 취소 시 취소 수수료가 부과될 수 있습니다.

4.2 본 약관 위반 시 보상 없이 계정 정지 또는 영구 탈퇴 처리될 수 있습니다.

5. 분쟁 해결

5.1 분쟁은 우선 조정을 통해 해결하며, 해결되지 않을 경우 인도네시아 공화국 법률에 따라 자카르타 남부 지방법원에서 해결합니다.

5.2 Linka는 고객과 파트너 간 분쟁의 당사자가 될 의무가 없습니다.

6. 약관 변경

Linka는 언제든지 본 약관을 변경할 권리를 보유합니다. 중요한 변경 사항은 시행 최소 7일 전 앱을 통해 고지됩니다.`,
      },
      privacy: {
        title: '개인정보 처리방침 및 수집·이용 동의',
        body: `최종 업데이트: 2025년 4월

1. 수집하는 개인정보

1.1 직접 제공 정보:
   • 성명, 휴대폰 번호, 비밀번호;
   • 프로필 사진 및 본인 확인 서류 사진;
   • 서비스 주소 및 위치;
   • 거래 내역 및 리뷰.

1.2 자동 수집 정보:
   • 기기 정보(기기 모델, OS, 기기 ID);
   • GPS 위치 데이터(앱 사용 중에만);
   • 앱 이용 활동 로그.

2. 개인정보 이용 목적

수집된 정보는 다음 목적으로 이용됩니다:
   • 플랫폼 서비스 제공 및 개선;
   • 본인 확인 및 부정 이용 방지;
   • 고객과 적합한 파트너 연결;
   • 서비스 알림 및 계정 업데이트 발송;
   • 관련 법령 및 규정 준수.

3. 개인정보 보안

3.1 고객의 데이터는 업계 표준 암호화 서버에 저장됩니다.

3.2 동의 없이 상업적 목적으로 개인정보를 제3자에게 판매하지 않습니다.

4. 정보 주체의 권리

다음 권리를 행사할 수 있습니다:
   • 언제든지 개인정보 열람 및 수정;
   • 계정 및 개인정보 삭제 요청;
   • 계정 삭제를 통한 동의 철회.

5. 문의

개인정보 관련 문의: privacy@linka.id`,
      },
      thirdparty: {
        title: '개인정보 제3자 제공 동의',
        body: `최종 업데이트: 2025년 4월

1. 개인정보를 제공받는 제3자

서비스 운영을 위해 Linka는 필요한 정보를 다음 대상에게 제공할 수 있습니다:
   • 결제 서비스 제공업체(거래 처리 목적);
   • 물류 및 본인 인증 파트너;
   • 분석 및 서비스 개선 서비스(Google Analytics, Firebase);
   • 법령에 따라 요구되는 경우 정부 기관.

2. 제공 데이터의 범위

2.1 각 특정 목적에 필요한 최소한의 데이터만 제공합니다.

2.2 데이터를 제공받는 모든 제3자는 당사와 동등한 수준의 기밀 유지 및 보안 기준을 준수해야 합니다.

2.3 개인 식별 정보(성명, 휴대폰 번호)를 광고주나 상업적 목적의 제3자에게 판매하지 않습니다.

3. 국외 이전

일부 제3자 서비스는 인도네시아 외부에서 데이터를 처리할 수 있습니다. 이 경우에도 동등한 수준의 보호가 적용됩니다.

4. 동의 철회

계정 삭제를 통해 동의를 철회할 수 있습니다. 철회는 이미 처리된 데이터에는 소급 적용되지 않습니다.`,
      },
      marketing: {
        title: '이벤트·혜택 및 커뮤니티 알림 수신 (선택)',
        body: `최종 업데이트: 2025년 4월

동의 시 다음 정보를 수신합니다:
   • Linka의 프로모션, 할인 및 특별 혜택 안내;
   • 커뮤니티 이벤트 및 프로그램 공지;
   • 서비스 이용 팁 및 교육 콘텐츠;
   • 이용자 만족도 설문.

발송 채널:
   • 앱 푸시 알림;
   • 등록된 번호로 WhatsApp / SMS;
   • 이메일(등록된 경우).

앱 내 설정 → 알림에서 언제든지 수신을 거부할 수 있습니다.

본 동의는 선택 사항이며, 동의 여부가 Linka 핵심 서비스 이용에 영향을 미치지 않습니다.`,
      },
    },
  },

  /* ──────────────── 中文 ──────────────── */
  zh: {
    pageTitle: '服务使用同意',
    overviewTitle: 'Linka服务政策概览',
    overviewBody:
      'Linka是一个连接客户与独立家政员（ART）或家教的技术平台。PT Linka Indonesia仅作为中介方，对用户与合作伙伴之间交易所产生的结果、质量或纠纷不承担责任。',
    policy1Title: 'Linka应用服务运营政策',
    policy1Body:
      'Linka应用是一个平台，为用户（客户）与助手（家政员或家教）提供信息，使他们能够互相寻找并联系。PT Linka Indonesia（以下简称"公司"）仅作为介绍客户与助手并进行匹配的中介，并非劳务派遣机构、招聘代理或助手的雇主。公司对客户与助手之间产生的任何问题不承担责任。',
    policy2Title: 'Linka会员义务',
    policy2Body:
      '会员须自行选择适合自己的助手或客户，并根据双方约定的合同条款或相关法律法规，诚实负责地开展所有活动。如果任何一方未经事先协调单方面通知解除合同，可能会根据服务条款受到相应处罚。',
    agreeAll: '同意全部条款',
    items: [
      { label: '（必填）同意服务运营政策及会员义务', required: true,  docKey: null        },
      { label: '（必填）服务使用条款',           required: true,  docKey: 'service'    },
      { label: '（必填）个人信息收集及使用同意', required: true,  docKey: 'privacy'    },
      { label: '（必填）同意向第三方提供个人信息', required: true,  docKey: 'thirdparty' },
      { label: '（可选）接收活动·优惠及社区通知', required: false, docKey: 'marketing'  },
    ],
    ctaAgree: '同意并继续',
    ctaClose: '关闭',
    docs: {
      service: {
        title: 'Linka服务使用条款',
        body: `最后更新：2025年4月

1. 定义与平台地位

1.1 PT Linka Indonesia（"Linka"、"我们"）运营一个数字平台，仅作为中介，将服务用户（"客户"）与独立服务提供商（"合作伙伴"）相连接。

1.2 Linka不是人力资源派遣机构、劳务中介或合作伙伴的雇主。合作伙伴是独立自由职业者，以自身名义和责任提供服务。

1.3 Linka对合作伙伴的工作方式、服务质量或相关法规的遵守情况不具有控制权。

2. 平台责任限制

2.1 Linka对以下情况不承担责任：
   • 合作伙伴服务期间或之后发生的财产损失、损坏或盗窃；
   • 涉及客户、合作伙伴或第三方的人身伤害、事故或事件；
   • 合作伙伴提供服务的质量、及时性或结果；
   • 客户与合作伙伴之间的纠纷、不和或违约；
   • 因使用平台而产生的任何间接、附带或后果性损失。

2.2 在任何情况下，可向Linka主张的最高赔偿额不超过争议交易的金额。

3. 客户义务与责任

3.1 客户对以下事项承担全部责任：
   • 在达成服务协议前核实合作伙伴的身份、能力和背景；
   • 在合作伙伴工作期间保护贵重物品、敏感文件及财产访问权限；
   • 提供安全合法的工作环境；
   • 按约定支付服务费用，不得单方面延迟或扣减。

3.2 客户严格禁止：
   • 将平台用于非法或有害目的；
   • 向合作伙伴或Linka提供虚假或误导性信息；
   • 骚扰、歧视或不当对待合作伙伴。

4. 取消与制裁

4.1 客户在预定服务时间24小时内取消可能须支付取消费用。

4.2 违反本条款可能导致账户被暂停或永久停用，且不予赔偿。

5. 争议解决

5.1 争议首先通过调解解决。如未能解决，依据印度尼西亚共和国法律在南雅加达地方法院解决。

5.2 Linka无义务成为客户与合作伙伴之间争议的当事方。

6. 条款变更

Linka保留随时更新本条款的权利。重大变更将在生效前至少7天通过应用程序通知。`,
      },
      privacy: {
        title: '隐私政策及个人数据使用',
        body: `最后更新：2025年4月

1. 我们收集的数据

1.1 您直接提供的数据：
   • 全名、手机号码、密码；
   • 头像及身份验证文件照片；
   • 服务地址及位置；
   • 交易记录和评价。

1.2 自动收集的数据：
   • 设备信息（型号、操作系统、设备ID）；
   • GPS位置数据（仅在应用程序使用期间）；
   • 应用使用活动日志。

2. 数据使用目的

我们使用您的数据用于：
   • 提供和改善平台服务；
   • 验证身份并防止欺诈；
   • 将客户与合适的合作伙伴匹配；
   • 发送服务通知和账户更新；
   • 履行适用的法律法规义务。

3. 数据安全

3.1 您的数据存储在符合行业标准的加密服务器上。

3.2 未经您同意，我们不会出于商业目的将您的个人数据出售给第三方。

4. 您的权利

您有权：
   • 随时访问和更新您的个人数据；
   • 请求删除账户和个人数据；
   • 通过删除账户撤回数据同意。

5. 联系方式

隐私问题：privacy@linka.id`,
      },
      thirdparty: {
        title: '同意向第三方共享数据',
        body: `最后更新：2025年4月

1. 接收数据的第三方

为运营服务，Linka可能与以下对象共享必要数据：
   • 支付服务提供商（处理交易）；
   • 物流和身份验证合作伙伴；
   • 分析和产品改进服务（Google Analytics、Firebase）；
   • 法律要求时的政府机构。

2. 数据共享限制

2.1 我们仅共享每个特定目的所需的最少数据。

2.2 所有接收数据的第三方须维护与我们相同标准的保密性和安全性。

2.3 我们不会将您的个人识别信息（姓名、手机号码）出售给任何广告商或商业方。

3. 国际数据传输

部分第三方服务可能在印度尼西亚境外处理数据。我们确保应用同等保护措施。

4. 撤回同意

您可以通过删除账户撤回同意。撤回不影响之前已完成的数据处理。`,
      },
      marketing: {
        title: '促销和社区通知（可选）',
        body: `最后更新：2025年4月

同意后，您将收到：
   • Linka的促销、折扣及特别优惠信息；
   • 社区活动和项目公告；
   • 服务使用技巧及教育内容；
   • 用户满意度调查。

通知发送渠道：
   • 应用内推送通知；
   • 发送至注册号码的WhatsApp / 短信；
   • 电子邮件（如已注册）。

您可随时通过应用内设置→通知取消接收。

本同意为可选项，不影响您使用Linka核心服务。`,
      },
    },
  },

  /* ──────────────── 日本語 ──────────────── */
  ja: {
    pageTitle: 'サービス利用同意',
    overviewTitle: 'Linkaサービスポリシー概要',
    overviewBody:
      'Linkaは、お客様と独立した家事ヘルパー（ART）または家庭教師を繋ぐテクノロジープラットフォームです。PT Linka Indonesiaは純粋な仲介者として機能し、ユーザーとパートナー間の取引から生じる結果、品質、紛争については責任を負いません。',
    policy1Title: 'Linkaアプリサービス運営方針',
    policy1Body:
      'Linkaアプリは、ユーザー（お客様）とヘルパー（家事アシスタントまたは家庭教師）が情報を見つけ連絡できるよう提供するプラットフォームです。PT Linka Indonesia（以下「当社」）は、お客様とヘルパーを紹介・マッチングする仲介者としてのみ機能し、人材派遣会社、採用代理店、またはヘルパーの雇用主ではありません。当社はお客様とヘルパー間に生じるいかなる問題についても責任を負いません。',
    policy2Title: 'Linkaアプリ会員の義務',
    policy2Body:
      '会員は自分に適したヘルパーまたはお客様を自ら選択し、相互に合意した契約条件または関連法令に基づいて誠実に活動する必要があります。事前調整なしに一方的に契約解除を通知した場合、サービス利用規約に基づいて制裁が科される場合があります。',
    agreeAll: '全ての利用規約に同意',
    items: [
      { label: '（必須）サービス運営方針および会員義務への同意', required: true,  docKey: null        },
      { label: '（必須）サービス利用規約への同意',           required: true,  docKey: 'service'    },
      { label: '（必須）個人情報の収集・利用に関する同意',   required: true,  docKey: 'privacy'    },
      { label: '（必須）第三者への個人情報提供に関する同意', required: true,  docKey: 'thirdparty' },
      { label: '（任意）イベント・特典・コミュニティ通知受信', required: false, docKey: 'marketing'  },
    ],
    ctaAgree: '同意して続ける',
    ctaClose: '閉じる',
    docs: {
      service: {
        title: 'Linkaサービス利用規約',
        body: `最終更新：2025年4月

1. 定義とプラットフォームの地位

1.1 PT Linka Indonesia（「Linka」「当社」）は、サービス利用者（「お客様」）と独立したサービス提供者（「パートナー」）を繋ぐ仲介プラットフォームを運営します。

1.2 Linkaは人材派遣会社、採用代理店、またはパートナーの雇用主ではありません。パートナーは独立したフリーランサーとして、自身の名前と責任でサービスを提供します。

1.3 Linkaはパートナーの業務遂行方法、サービス品質、または適用法令の遵守について管理権を持ちません。

2. プラットフォームの責任制限

2.1 Linkaは以下について責任を負いません：
   • パートナーのサービス中または後に発生した財産の損失、損害、盗難；
   • お客様、パートナー、または第三者が関与する身体的傷害、事故、事件；
   • パートナーが提供するサービスの品質、適時性、または成果；
   • お客様とパートナー間の紛争、不和、または契約違反；
   • プラットフォームの使用から生じるいかなる間接的、付随的、または結果的損失。

2.2 いかなる状況においても、Linkaに対して請求できる最大賠償額は、紛争対象取引の金額を超えないものとします。

3. お客様の義務と責任

3.1 お客様は以下について全責任を負います：
   • サービス契約前にパートナーの身元、能力、経歴を確認すること；
   • パートナーの作業中に貴重品、機密書類、資産へのアクセスを保護すること；
   • 安全で適法な作業環境を提供すること；
   • 一方的な遅延や減額なしに合意した報酬を支払うこと。

3.2 お客様には以下の行為が厳禁されます：
   • 違法または有害な目的でプラットフォームを利用すること；
   • パートナーまたはLinkaに虚偽または誤解を招く情報を提供すること；
   • パートナーへのハラスメント、差別、または不適切な行為。

4. キャンセルと制裁

4.1 予定サービス時間の24時間以内にお客様がキャンセルした場合、キャンセル料が発生する場合があります。

4.2 本規約違反は、補償なしにアカウントの停止または永久退会処理につながる場合があります。

5. 紛争解決

5.1 紛争はまず調停を通じて解決します。解決しない場合、インドネシア共和国法律に基づき南ジャカルタ地方裁判所で解決します。

5.2 Linkaはお客様とパートナー間の紛争の当事者となる義務を負いません。

6. 規約の変更

Linkaはいつでも本規約を更新する権利を留保します。重要な変更は発効の少なくとも7日前にアプリ内でお知らせします。`,
      },
      privacy: {
        title: 'プライバシーポリシー・個人情報の利用',
        body: `最終更新：2025年4月

1. 収集する個人情報

1.1 直接提供される情報：
   • 氏名、電話番号、パスワード；
   • プロフィール写真および本人確認書類の写真；
   • サービス住所および位置情報；
   • 取引履歴およびレビュー。

1.2 自動収集される情報：
   • デバイス情報（機種、OS、デバイスID）；
   • GPS位置データ（アプリ使用中のみ）；
   • アプリ使用活動ログ。

2. 個人情報の利用目的

収集した情報は以下の目的で使用されます：
   • プラットフォームサービスの提供および改善；
   • 本人確認および不正防止；
   • お客様に適したパートナーのマッチング；
   • サービス通知およびアカウント更新の送信；
   • 適用法令および規制の遵守。

3. データセキュリティ

3.1 お客様のデータは業界標準の暗号化サーバーに保存されます。

3.2 同意なしに商業目的でお客様の個人情報を第三者に販売しません。

4. お客様の権利

以下の権利を行使できます：
   • いつでも個人情報を閲覧・更新できます；
   • アカウントおよび個人情報の削除を請求できます；
   • アカウント削除によりデータ同意を撤回できます。

5. お問い合わせ

プライバシーに関するお問い合わせ：privacy@linka.id`,
      },
      thirdparty: {
        title: '第三者への個人情報提供に関する同意',
        body: `最終更新：2025年4月

1. 情報を受け取る第三者

サービス運営のため、Linkaは以下と必要な情報を共有する場合があります：
   • 決済サービスプロバイダー（取引処理のため）；
   • 物流および本人確認パートナー；
   • 分析およびサービス改善サービス（Google Analytics、Firebase）；
   • 法律で要求される場合の政府機関。

2. データ共有の制限

2.1 各特定目的に必要な最小限のデータのみを共有します。

2.2 データを受け取るすべての第三者は、当社と同等の機密保持およびセキュリティ基準を維持する必要があります。

2.3 個人識別情報（氏名、電話番号）を広告主や商業的目的の第三者に販売しません。

3. 国際データ移転

一部の第三者サービスはインドネシア国外でデータを処理する場合があります。同等の保護措置が適用されます。

4. 同意の撤回

アカウントを削除することで同意を撤回できます。撤回は既に処理されたデータには遡って適用されません。`,
      },
      marketing: {
        title: 'イベント・特典・コミュニティ通知（任意）',
        body: `最終更新：2025年4月

同意することで、以下を受け取ることに同意します：
   • Linkaのプロモーション、割引、特別オファー情報；
   • コミュニティイベントやプログラムのお知らせ；
   • サービス利用のヒントと教育コンテンツ；
   • ユーザー満足度調査。

通知の送信チャネル：
   • アプリ内プッシュ通知；
   • 登録番号へのWhatsApp / SMS；
   • メール（登録済みの場合）。

アプリ内の設定→通知からいつでも受信を停止できます。

本同意は任意であり、同意の有無はLinkaのコアサービスへのアクセスに影響しません。`,
      },
    },
  },
};

// ── Full-text document modal ──────────────────────────────────────

function DocModal({
  visible, doc, onClose, lang,
}: {
  visible: boolean;
  doc: LegalDoc | null;
  onClose: () => void;
  lang: LangCode;
}) {
  const slideY = useRef(new Animated.Value(SH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 0 }).start();
    } else {
      Animated.timing(slideY, { toValue: SH, useNativeDriver: true, duration: 220 }).start();
    }
    return () => {
      slideY.stopAnimation();   // Android native 노드 race 방지
    };
  }, [visible]);

  const closeLabel = lang === 'ko' ? '닫기' : lang === 'en' ? 'Close' : lang === 'ja' ? '閉じる' : lang === 'zh' ? '关闭' : 'Tutup';

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={dm.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[dm.sheet, { transform: [{ translateY: slideY }] }]}>
          {/* Handle */}
          <View style={dm.handle} />
          <Text style={dm.docTitle} numberOfLines={2}>{doc?.title}</Text>
          <ScrollView style={dm.docScroll} contentContainerStyle={dm.docContent} showsVerticalScrollIndicator={false}>
            <Text style={dm.docBody}>{doc?.body}</Text>
            <View style={{ height: 40 }} />
          </ScrollView>
          <View style={dm.docFooter}>
            <TouchableOpacity style={dm.closeBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={dm.closeBtnText}>{closeLabel}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const dm = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: SH * 0.88,
    paddingTop: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.borderMid,
    alignSelf: 'center', marginBottom: 16,
  },
  docTitle: {
    fontSize: 15, fontWeight: '700', color: Colors.dark,
    paddingHorizontal: 20, marginBottom: 12,
  },
  docScroll: { flex: 1 },
  docContent: { paddingHorizontal: 20 },
  docBody: { fontSize: 12, color: Colors.gray, lineHeight: 20 },
  docFooter: {
    paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 20, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  closeBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.pill,
    paddingVertical: 14, alignItems: 'center',
  },
  closeBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});

// ── Main component ────────────────────────────────────────────────

export default function TermsScreen({ route, navigation }: Props) {
  const { mode } = route.params;
  const { lang } = useLanguageStore();
  const insets = useSafeAreaInsets();
  const c = CONTENT[lang] ?? CONTENT.id;

  const [checked, setChecked] = useState<boolean[]>(c.items.map(() => false));
  const [activeDoc, setActiveDoc] = useState<LegalDoc | null>(null);
  const [docVisible, setDocVisible] = useState(false);

  const allChecked   = checked.length === c.items.length && checked.every(Boolean);
  const reqSatisfied = c.items.every((item, i) => !item.required || (checked[i] ?? false));

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(c.items.map(() => next));
  };

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  const openDoc = (docKey: DocKey) => {
    setActiveDoc(c.docs[docKey]);
    setDocVisible(true);
  };

  const viewLabel = lang === 'ko' ? '보기' : lang === 'en' ? 'View' : lang === 'ja' ? '見る' : lang === 'zh' ? '查看' : 'Lihat';

  return (
    <View style={s.root}>
      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={s.topTitle}>{c.pageTitle}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Inline policy sections */}
        <View style={s.policyWrap}>
          <View style={s.policySection}>
            <Text style={s.policySectionTitle}>{c.policy1Title}</Text>
            <Text style={s.policySectionBody}>{c.policy1Body}</Text>
          </View>
          <View style={s.policySectionDivider} />
          <View style={s.policySection}>
            <Text style={s.policySectionTitle}>{c.policy2Title}</Text>
            <Text style={s.policySectionBody}>{c.policy2Body}</Text>
          </View>
        </View>

        {/* Agreement checklist (agree mode only) */}
        {mode === 'agree' && (
          <View style={s.agreeSection}>
            {/* Agree all */}
            <TouchableOpacity style={s.agreeAllRow} onPress={toggleAll} activeOpacity={0.8}>
              <View style={[s.bigCheck, allChecked && s.bigCheckOn]}>
                {allChecked && <Ionicons name="checkmark" size={16} color={Colors.white} />}
              </View>
              <Text style={s.agreeAllText}>{c.agreeAll}</Text>
            </TouchableOpacity>

            <View style={s.divider} />

            {/* Individual items */}
            {c.items.map((item, i) => (
              <View key={i} style={s.itemRow}>
                <TouchableOpacity onPress={() => toggle(i)} style={s.itemCheckArea} activeOpacity={0.75}>
                  <View style={[s.smallCheck, checked[i] && s.smallCheckOn]}>
                    {checked[i] && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                  </View>
                  <Text style={[s.itemLabel, !item.required && s.itemLabelOpt]} numberOfLines={2}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
                {item.docKey && (
                  <TouchableOpacity
                    onPress={() => openDoc(item.docKey!)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={s.viewBtnWrap}
                  >
                    <Ionicons name="chevron-forward" size={14} color={Colors.grayLight} />
                    <Text style={s.viewBtnText}>{viewLabel}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* View mode — all docs listed as tappable rows */}
        {mode === 'view' && (
          <View style={s.viewDocList}>
            {(Object.keys(c.docs) as DocKey[]).map((key) => (
              <TouchableOpacity key={key} style={s.viewDocRow} onPress={() => openDoc(key)} activeOpacity={0.75}>
                <Ionicons name="document-text-outline" size={16} color={Colors.gray} />
                <Text style={s.viewDocLabel}>{c.docs[key].title}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.grayLight} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottomBar}>
        {mode === 'agree' ? (
          <TouchableOpacity
            style={[s.ctaBtn, !reqSatisfied && s.ctaBtnDisabled]}
            disabled={!reqSatisfied}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={s.ctaBtnText}>{c.ctaAgree}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.ctaBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={s.ctaBtnText}>{c.ctaClose}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Full-text document bottom sheet */}
      <DocModal
        visible={docVisible}
        doc={activeDoc}
        onClose={() => setDocVisible(false)}
        lang={lang}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: Colors.section,
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },

  scroll: { padding: 16 },

  policyWrap: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  policySection:        { padding: 16, gap: 8 },
  policySectionDivider: { height: 1, backgroundColor: Colors.border },
  policySectionTitle:   { fontSize: 13, fontWeight: '800', color: Colors.dark, lineHeight: 20 },
  policySectionBody:    { fontSize: 12, color: Colors.gray, lineHeight: 20 },

  overviewCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.accent + '30',
    padding: 16, gap: 10,
  },
  overviewBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  overviewBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
  overviewBody: { fontSize: 12, color: Colors.dark, lineHeight: 20 },

  agreeSection: {
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  agreeAllRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, backgroundColor: Colors.section,
  },
  bigCheck: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  bigCheckOn: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  agreeAllText: { fontSize: 14, fontWeight: '700', color: Colors.dark, flex: 1 },

  divider: { height: 1, backgroundColor: Colors.border },

  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingLeft: 16, paddingRight: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 0,
  },
  itemCheckArea: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  smallCheck: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.borderMid,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  smallCheckOn: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  itemLabel:    { flex: 1, fontSize: 13, color: Colors.dark, lineHeight: 18 },
  itemLabelOpt: { color: Colors.gray },
  viewBtnWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    paddingLeft: 8,
  },
  viewBtnText: { fontSize: 11, color: Colors.grayLight },

  // View mode doc list
  viewDocList: {
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  viewDocRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  viewDocLabel: { flex: 1, fontSize: 13, color: Colors.dark, fontWeight: '500' },

  bottomBar: {
    paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 36 : 20, paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  ctaBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnDisabled: { backgroundColor: Colors.borderMid },
  ctaBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
