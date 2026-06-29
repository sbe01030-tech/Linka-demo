/**
 * Portrait photos — 전부 로컬 번들 에셋 (네트워크 의존 제거).
 * 원본은 Pexels에서 받아 assets/portraits/ 에 저장. require → URI 문자열로 변환해
 * 기존 `{uri: ...}` 렌더 사이트와 그대로 호환되고, 두 시뮬레이터 동기화(JSON)도 가능.
 */
import { Image } from 'react-native';
const localUri = (mod: number): string => Image.resolveAssetSource(mod).uri;

// ── Workers (ART / helpers) ──────────────────────────────────
export const W1  = localUri(require('../../assets/portraits/w1.jpg'));   // Sari Dewi
export const W2  = localUri(require('../../assets/portraits/w2.jpg'));   // Rina Wulandari
export const W3  = localUri(require('../../assets/portraits/w3.jpg'));   // Dewi Anggraeni
export const W4  = localUri(require('../../assets/portraits/w4.jpg'));   // Fitri Handayani
export const W5  = localUri(require('../../assets/portraits/w5.jpg'));   // Indah Lestari
export const W6  = localUri(require('../../assets/portraits/w6.jpg'));   // Nur Aini Susanti
export const W7  = localUri(require('../../assets/portraits/w7.jpg'));   // Siti Rahayu
export const W8  = localUri(require('../../assets/portraits/w8.jpg'));   // Wulandari Putri

// ── Extra workers / map partners ────────────────────────────
export const W9  = localUri(require('../../assets/portraits/w9.jpg'));
export const W10 = localUri(require('../../assets/portraits/w10.jpg'));
export const W11 = localUri(require('../../assets/portraits/w11.jpg'));
export const W12 = localUri(require('../../assets/portraits/w12.jpg'));

// ── Customers / reviewers ───────────────────────────────────
export const C1  = localUri(require('../../assets/portraits/c1.jpg'));
export const C2  = localUri(require('../../assets/portraits/c2.jpg'));
export const C3  = localUri(require('../../assets/portraits/c3.jpg'));
export const C4  = localUri(require('../../assets/portraits/c4.jpg'));
export const C5  = localUri(require('../../assets/portraits/c5.jpg'));
export const C6  = localUri(require('../../assets/portraits/c6.jpg'));

// ── Male customer ────────────────────────────────────────────
export const MALE1 = localUri(require('../../assets/portraits/male1.jpg'));

// ── Drivers (local assets, male Indonesian drivers) ─────────
// 로컬 이미지 — Image source에 직접 전달 가능 (number 타입)
export const D1  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 001.jpeg');
export const D2  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 002.jpeg');
export const D3  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 003.jpeg');
export const D4  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 004.jpeg');
export const D5  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 005.jpeg');
export const D6  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 006.jpeg');
export const D7  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 007.jpeg');
export const D8  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 008.jpeg');
export const D9  = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-22 009.jpeg');
export const D10 = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-38 001.jpeg');
export const D11 = require('../../assets/drivers/KakaoTalk_Photo_2026-04-24-13-52-38 002.jpeg');

// ── 데모 고정 인물 (로컬 에셋) ───────────────────────────────
// 보내는 고객 = 김도형 대표님 (Kim.png). 기존 seongki.png는 보존(나중에 재사용 가능)
export const SEONGKI_PHOTO = localUri(require('../../assets/people/Kim.png'));
// 워커 = Max Park (박재현 이미지)
export const MAXPARK_PHOTO = localUri(require('../../assets/people/maxpark.jpg'));

// 워커 프로필 갤러리 — 청소 비포/애프터 (사용자가 assets/gallery/ba*.jpg 교체)
export const BA1 = localUri(require('../../assets/gallery/ba1.jpg'));
export const BA2 = localUri(require('../../assets/gallery/ba2.jpg'));
export const BA3 = localUri(require('../../assets/gallery/ba3.jpg'));
export const BA4 = localUri(require('../../assets/gallery/ba4.jpg'));

// ── Stack avatars (count bar) ────────────────────────────────
export const AVATAR_STACK = [W1, W4, C1];
