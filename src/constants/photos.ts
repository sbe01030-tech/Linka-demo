/**
 * SE Asian portrait photos (Pexels)
 * Assigned to specific worker/customer roles.
 */

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;

// ── Workers (ART / helpers) ──────────────────────────────────
export const W1  = px(33401794);  // kebaya putih, kota  — Sari Dewi
export const W2  = px(33401792);  // kebaya putih, samping — Rina Wulandari
export const W3  = px(5987082);   // casual, alam         — Dewi Anggraeni
export const W4  = px(13815817);  // batik, bambu          — Fitri Handayani
export const W5  = px(13945649);  // smart casual          — Indah Lestari
export const W6  = px(29437184);  // hijab merah, bendera  — Nur Aini Susanti
export const W7  = px(29343880);  // hijab putih, bendera  — Siti Rahayu
export const W8  = px(35247296);  // kebaya, outdoor       — Wulandari Putri

// ── Extra workers / map partners ────────────────────────────
export const W9  = px(1124714);   // traditional, Jawa
export const W10 = px(36382832);  // casual green, bambu
export const W11 = px(36490973);  // caping, senyum
export const W12 = px(36459949);  // ao dai merah marun

// ── Customers / reviewers ───────────────────────────────────
export const C1  = px(8582641);   // ao dai, bunga kuning
export const C2  = px(36146089);  // ao dai pink floral
export const C3  = px(29244028);  // ao dai biru, caping
export const C4  = px(13119680);  // non la merah
export const C5  = px(12770337);  // non la emas, tutup mata
export const C6  = px(29451034);  // street style, urban

// ── Male customer ────────────────────────────────────────────
export const MALE1 = px(33549701); // bapak tradisional Jawa

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

// ── Stack avatars (count bar) ────────────────────────────────
export const AVATAR_STACK = [W1, W4, C1];
