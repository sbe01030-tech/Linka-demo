/**
 * Linka 데모용 로컬 동기화 서버 (의존성 없음, Node 내장 http만 사용)
 *
 * 두 개의 iOS 시뮬레이터(아이폰 15 Pro = 고객 / 17 Pro = 워커)가 같은 Mac의
 * 이 서버(localhost:4000)를 폴링하며 메시지·예약·대화방을 공유한다.
 *
 * 실행:  node sync-server.js
 * 초기화: curl -X POST http://localhost:4000/reset
 *
 * 메모리에만 보관(서버 재시작 시 초기화) · 단일 Mac 데모 전용.
 */
const http = require('http');

const PORT = 4000;

// 서버 상태 (전부 id로 dedupe)
let state = {
  threads: [],                 // ChatThreadRec[]
  messagesByThread: {},        // { [threadId]: ChatMessage[] }
  bookings: [],                // Booking[]
};

const json = (res, code, obj) => {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });

const upsertById = (arr, item) => {
  if (!item || item.id == null) return arr;
  if (arr.some((x) => x.id === item.id)) return arr;
  return [...arr, item];
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 200, {});

  const url = req.url || '/';

  if (req.method === 'GET' && url.startsWith('/state')) {
    return json(res, 200, state);
  }

  if (req.method === 'POST' && url.startsWith('/push')) {
    const body = await readBody(req);
    const { kind, payload } = body;

    if (kind === 'thread' && payload) {
      state.threads = upsertById(state.threads, payload);
      if (!state.messagesByThread[payload.id]) state.messagesByThread[payload.id] = [];
    } else if (kind === 'message' && payload && payload.threadId) {
      const tid = payload.threadId;
      const list = state.messagesByThread[tid] || [];
      if (!list.some((m) => m.id === payload.msg.id)) {
        state.messagesByThread[tid] = [...list, payload.msg];
      }
    } else if (kind === 'booking' && payload) {
      state.bookings = upsertById(state.bookings, payload);
    }
    return json(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.startsWith('/reset')) {
    state = { threads: [], messagesByThread: {}, bookings: [] };
    console.log('[sync] state reset');
    return json(res, 200, { ok: true });
  }

  json(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`\n  ✅ Linka sync server  →  http://localhost:${PORT}`);
  console.log(`     GET  /state   POST /push   POST /reset\n`);
});
