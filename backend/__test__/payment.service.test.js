jest.mock("../src/config/db");
jest.mock("../src/services/achievement.service");

const { aplicarEstadoTransaccion } = require("../src/services/payment.service");
const pool = require("../src/config/db");
const achievementService = require("../src/services/achievement.service");

/* Reproduce la validación REAL de node-postgres (pg/lib/query.js):
   si "values" no es un array, submit() lanza "Query values must be an array"
   ANTES de tocar la red. Con esto el test refleja el fallo real en producción. */
const respuestasMock = [];
pool.query.mockImplementation((text, values) => {
  if (values !== undefined && !Array.isArray(values)) {
    return Promise.reject(new Error("Query values must be an array"));
  }
  const respuesta = respuestasMock.shift() || { rows: [] };
  return Promise.resolve(respuesta);
});

describe("payment.service — aplicarEstadoTransaccion (webhook Wompi)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    respuestasMock.length = 0;
  });

  test("C1: un APPROVED de premium activa el plan y otorga el logro", async () => {
    respuestasMock.push({ rows: [{ id: 1, concept: "premium", user_id: "uuid-u1" }] });

    await expect(
      aplicarEstadoTransaccion({
        id: "txn-abc",
        status: "APPROVED",
        reference: "MEVOCATIO-PREMIUM-PLAN-1700000000000-a1b2c3",
      })
    ).resolves.toBeUndefined();

    const updateUserCall = pool.query.mock.calls.find((c) => c[0].includes("UPDATE users SET plan"));
    expect(updateUserCall).toBeDefined();
    expect(updateUserCall[0]).toContain("SET plan = 'premium'");
    expect(Array.isArray(updateUserCall[1])).toBe(true);
    expect(updateUserCall[1]).toEqual(["uuid-u1"]);
    expect(achievementService.registrarCompraPremium).toHaveBeenCalledWith("uuid-u1");
  });

  test("C1: un APPROVED DECLINED de premium no activa el plan", async () => {
    respuestasMock.push({ rows: [{ id: 2, concept: "premium", user_id: "uuid-u2" }] });

    await aplicarEstadoTransaccion({
      id: "txn-2",
      status: "DECLINED",
      reference: "MEVOCATIO-PREMIUM-PLAN-1700000000000-f00df0",
    });

    expect(pool.query.mock.calls.some((c) => c[0].includes("UPDATE users SET plan"))).toBe(false);
    expect(achievementService.registrarCompraPremium).not.toHaveBeenCalled();
  });

  test("C1: un APPROVED de curso lo pasa a 'pagado' y 'revision'", async () => {
    respuestasMock.push({ rows: [{ id: 3, concept: "curso", course_id: 42 }] });

    await aplicarEstadoTransaccion({
      id: "txn-3",
      status: "APPROVED",
      reference: "MEVOCATIO-CURSO-42-1700000000000-c0ffee",
    });

    const updateCourseCall = pool.query.mock.calls.find((c) => c[0].includes("UPDATE courses SET payment_status"));
    expect(updateCourseCall).toBeDefined();
    expect(updateCourseCall[0]).toContain("status = 'revision'");
    expect(Array.isArray(updateCourseCall[1])).toBe(true);
    expect(updateCourseCall[1]).toEqual([42]);
  });

  test("C1: sin pago correspondiente no hace nada (reference desconocida)", async () => {
    respuestasMock.push({ rows: [] });

    await aplicarEstadoTransaccion({
      id: "txn-4",
      status: "APPROVED",
      reference: "MEVOCATIO-PREMIUM-PLAN-1700000000000-deadbeef",
    });

    expect(pool.query.mock.calls.length).toBe(1); // solo el primer UPDATE payments
  });
});