import http from "k6/http";
import { check, group, sleep } from "k6";

// =========================
// Config por ENV
// =========================
const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

// Hot accounts fijas
const HOT_IDS = [1, 2, 3, 4, 5];

// Rango de cuentas "no-hot" (asumimos IDs numéricas y existentes)
const MIN_NORMAL_ID = __ENV.MIN_NORMAL_ID ? parseInt(__ENV.MIN_NORMAL_ID, 10) : 6;
const MAX_ACCOUNT_ID = __ENV.MAX_ACCOUNT_ID ? parseInt(__ENV.MAX_ACCOUNT_ID, 10) : 300;

// Qué porcentaje del tráfico pega al hotspot
const HOT_RATIO = __ENV.HOT_RATIO ? parseFloat(__ENV.HOT_RATIO) : 0.85;

// Montos (ajusta para evitar agotar saldo)
const MIN_AMOUNT = __ENV.MIN_AMOUNT ? parseFloat(__ENV.MIN_AMOUNT) : 1;
const MAX_AMOUNT = __ENV.MAX_AMOUNT ? parseFloat(__ENV.MAX_AMOUNT) : 5;

// Seed reproducible
const SEED = __ENV.SEED ? parseInt(__ENV.SEED, 10) : 12345;

// =========================
// Opciones k6 (concurrencia real)
// =========================
export const options = {
  scenarios: {
    transferencias_concurrentes: {
      executor: "ramping-arrival-rate",
      startRate: __ENV.START_RATE ? parseInt(__ENV.START_RATE, 10) : 20,
      timeUnit: "1s",
      preAllocatedVUs: __ENV.PRE_VUS ? parseInt(__ENV.PRE_VUS, 10) : 20,
      maxVUs: __ENV.MAX_VUS ? parseInt(__ENV.MAX_VUS, 10) : 100,
      stages: [
        { target: __ENV.TARGET_RATE ? parseInt(__ENV.TARGET_RATE, 10) : 200, duration: "30s" },
        { target: __ENV.TARGET_RATE ? parseInt(__ENV.TARGET_RATE, 10) : 200, duration: "1m" },
        { target: 0, duration: "15s" },
      ],
      tags: { scenario: "1_concurrency", operation: "transfer" },
    },
  },
  thresholds: {
    http_req_failed: ["rate<5"],
    http_req_duration: ["p(95)<800", "p(99)<1500"],
  },
};

// =========================
// Helpers
// =========================
function jsonHeaders() {
  return { headers: { "Content-Type": "application/json" } };
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randAmount(rng) {
  const raw = MIN_AMOUNT + (MAX_AMOUNT - MIN_AMOUNT) * rng();
  return Math.round(raw * 100) / 100;
}

function pickPairDifferent(rng, pickFn) {
  const a = pickFn();
  let b = pickFn();
  if (b === a) b = pickFn();
  return [a, b];
}

// =========================
// Default: 1 iteración = 1 transferencia
// =========================
export default function () {
  const rng = mulberry32(SEED + __VU * 100000 + __ITER);

  group("Escenario 1 - Concurrencia (transferencias simultáneas)", () => {
    const useHot = rng() < HOT_RATIO;

    let originId, destId;

    if (useHot) {
      // Contención: ambos dentro de 1..5
      [originId, destId] = pickPairDifferent(rng, () => pickOne(rng, HOT_IDS));
    } else {
      // Tráfico normal: usa cuentas fuera del hotspot
      // Si quieres mezclar hot->normal o normal->hot, te lo ajusto después.
      [originId, destId] = pickPairDifferent(rng, () =>
        randInt(rng, MIN_NORMAL_ID, MAX_ACCOUNT_ID)
      );
    }

    const monto = randAmount(rng);

    const res = http.post(
      `${BASE_URL}/transferencias`,
      JSON.stringify({
        cuenta_origen_id: originId,
        cuenta_destino_id: destId,
        monto,
      }),
      jsonHeaders()
    );

    // Para concurrencia, algunos errores son esperables (saldo insuficiente/conflictos)
    check(res, {
      "status esperado (2xx o 409/422)": (r) =>
        (r.status >= 200 && r.status < 300) || r.status === 409 || r.status === 422,
    });

    // Pequeña desincronización
    sleep(rng() * 0.15);
  });
}

