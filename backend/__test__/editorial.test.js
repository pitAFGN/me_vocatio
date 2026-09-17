jest.mock("../src/config/db");
jest.mock("../src/services/email.service");

const adminController = require("../src/controllers/admin.controller");
const courseService = require("../src/services/course.service");
const pool = require("../src/config/db");
const emailService = require("../src/services/email.service");

/* ─────────────────────────────────────────
   FLUJO EDITORIAL: creación de cursos
───────────────────────────────────────── */
describe("Flujo editorial: crear curso", () => {
  const nuevoCurso = { id: 10, title: "Mi curso", status: "revision" };

  beforeEach(() => jest.clearAllMocks());

  test("Todo curso nuevo nace en 'revision' e ignora el status del cliente", async () => {
    const client = {
      query: jest.fn((sql) => {
        if (sql.includes("INSERT INTO courses")) return Promise.resolve({ rows: [nuevoCurso] });
        return Promise.resolve({ rows: [] }); // BEGIN, lecciones, COMMIT
      }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);

    const result = await courseService.crearCurso("uuid-instructor", {
      title: "Mi curso",
      description: "desc",
      category: "Tecnología",
      lessons_list: [{ title: "Lección 1" }],
      status: "activo", // el cliente intenta publicar directo -> debe ignorarse
    });

    const insertCall = client.query.mock.calls.find((c) => c[0].includes("INSERT INTO courses"));
    expect(insertCall).toBeDefined();
    // El status se fuerza en el SQL como literal 'revision'
    expect(insertCall[0]).toContain("'revision'");
    // La lista de parámetros no incluye el status del cliente
    expect(insertCall[1].length).toBe(8);
    expect(insertCall[1]).not.toContain("activo");
    expect(result.status).toBe("revision");
  });

  test("Duplicado pendiente responde 409 con mensaje claro (nunca 500)", async () => {
    const client = {
      query: jest.fn((sql) => {
        if (sql.includes("INSERT INTO courses")) {
          const err = new Error("duplicate key value violates unique constraint");
          err.code = "23505";
          return Promise.reject(err);
        }
        return Promise.resolve({ rows: [] });
      }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);

    await expect(
      courseService.crearCurso("uuid-instructor", {
        title: "Mi curso",
        description: "Una descripción de prueba con longitud válida",
        category: "Tecnología",
      })
    ).rejects.toMatchObject({ status: 409, code: "CURSO_PENDING_DUPLICADO" });
  });
});

/* ─────────────────────────────────────────
   FLUJO EDITORIAL: edición de cursos
───────────────────────────────────────── */
describe("Flujo editorial: actualizar curso", () => {
  beforeEach(() => jest.clearAllMocks());

  const clienteActualizar = () => ({
    query: jest.fn().mockResolvedValue({ rows: [] }),
    release: jest.fn(),
  });

  test("Editar un curso activo NO lo despublica (ni lo vuelve a revisión)", async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 5, instructor_id: "uuid-1", title: "Curso A", status: "activo", background_style: "bg-slate-950", badges: null }],
      })
      .mockResolvedValueOnce({ rows: [{ plan: "premium" }] });

    const client = clienteActualizar();
    pool.connect.mockResolvedValue(client);

    await courseService.actualizarCurso(5, "uuid-1", { title: "Curso A v2", status: "published" });

    const updateCall = client.query.mock.calls.find((c) => c[0].includes("UPDATE courses"));
    expect(updateCall[1][5]).toBe("activo");
  });

  test("Si el curso estaba rechazado y el autor lo reenvía, pasa a 'revision'", async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 6, instructor_id: "uuid-2", title: "Curso B", status: "rechazado", background_style: "bg-slate-950", badges: null }],
      })
      .mockResolvedValueOnce({ rows: [{ plan: "premium" }] });

    const client = clienteActualizar();
    pool.connect.mockResolvedValue(client);

    await courseService.actualizarCurso(6, "uuid-2", { title: "Curso B arreglado", status: "revision" });

    const updateCall = client.query.mock.calls.find((c) => c[0].includes("UPDATE courses"));
    expect(updateCall[1][5]).toBe("revision");
  });

  test("Un autor no puede publicar directo: 'activo'/'published' nunca se aplican como status", async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 7, instructor_id: "uuid-3", title: "Curso C", status: "revision", background_style: "bg-slate-950", badges: null }],
      })
      .mockResolvedValueOnce({ rows: [{ plan: "premium" }] });

    const client = clienteActualizar();
    pool.connect.mockResolvedValue(client);

    await courseService.actualizarCurso(7, "uuid-3", { title: "Curso C", status: "activo" });

    const updateCall = client.query.mock.calls.find((c) => c[0].includes("UPDATE courses"));
    expect(updateCall[1][5]).toBe("revision"); // sigue en revisión, no se publica
  });

  test("Si el curso YA fue aprobado, el autor puede volver a mostrarlo ('activo')", async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 8, instructor_id: "uuid-4", title: "Curso D", status: "inactivo", approved_at: new Date("2026-01-01T00:00:00Z"), background_style: "bg-slate-950", badges: null }],
      })
      .mockResolvedValueOnce({ rows: [{ plan: "premium" }] });

    const client = clienteActualizar();
    pool.connect.mockResolvedValue(client);

    await courseService.actualizarCurso(8, "uuid-4", { status: "activo" });

    const updateCall = client.query.mock.calls.find((c) => c[0].includes("UPDATE courses"));
    expect(updateCall[1][5]).toBe("activo");
  });

  test("Toggle de visibilidad no rompe con badges no vacíos (badges siempre JSON)", async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 11, instructor_id: "uuid-6", title: "Curso F", status: "activo", approved_at: new Date("2026-01-01T00:00:00Z"), background_style: "bg-slate-950", badges: ["Elite"], level: "Principiante", duration_hours: null, description: "d", category: "c" }],
      })
      .mockResolvedValueOnce({ rows: [{ plan: "premium" }] });

    const client = clienteActualizar();
    pool.connect.mockResolvedValue(client);

    await courseService.actualizarCurso(11, "uuid-6", { status: "inactivo" });

    const updateCall = client.query.mock.calls.find((c) => c[0].includes("UPDATE courses"));
    expect(updateCall[1][5]).toBe("inactivo");
    expect(updateCall[1][7]).toBe('["Elite"]'); // nunca un array JS crudo (22P02)
  });

  test("Un 'activo' sin historial de aprobación se ignora (no salta el flujo editorial)", async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ id: 10, instructor_id: "uuid-5", title: "Curso E", status: "inactivo", approved_at: null, background_style: "bg-slate-950", badges: null }],
      })
      .mockResolvedValueOnce({ rows: [{ plan: "premium" }] });

    const client = clienteActualizar();
    pool.connect.mockResolvedValue(client);

    await courseService.actualizarCurso(10, "uuid-5", { title: "Curso E editado", status: "activo" });

    const updateCall = client.query.mock.calls.find((c) => c[0].includes("UPDATE courses"));
    expect(updateCall[1][5]).toBe("inactivo");
  });
});

/* ─────────────────────────────────────────
   FLUJO EDITORIAL: visibilidad del curso
───────────────────────────────────────── */
describe("Flujo editorial: visibilidad de obtenerCursoPorId", () => {
  beforeEach(() => jest.clearAllMocks());

  const baseCurso = (status) => ({
    id: 9,
    title: "Curso",
    status,
    instructor_id: "uuid-autor",
    rejection_reason: null,
  });

  test("Un curso activo es visible para el público", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [baseCurso("activo")] })
      .mockResolvedValueOnce({ rows: [{ id: 1, title: "L1" }] });

    const curso = await courseService.obtenerCursoPorId(9);
    expect(curso.status).toBe("activo");
    expect(curso.lessons).toHaveLength(1);
  });

  test("Un curso en revisión NO es visible para el público (404)", async () => {
    pool.query.mockResolvedValueOnce({ rows: [baseCurso("revision")] });

    await expect(courseService.obtenerCursoPorId(9)).rejects.toMatchObject({ status: 404 });
  });

  test("El autor sí ve su curso en revisión", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [baseCurso("revision")] })
      .mockResolvedValueOnce({ rows: [{ id: 1, title: "L1" }] });

    const curso = await courseService.obtenerCursoPorId(9, { id: "uuid-autor" });
    expect(curso.status).toBe("revision");
  });

  test("Un admin sí ve un curso en revisión de otro autor", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [baseCurso("rechazado")] })
      .mockResolvedValueOnce({ rows: [{ role: "admin" }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, title: "L1" }] });

    const curso = await courseService.obtenerCursoPorId(9, { id: "uuid-admin" });
    expect(curso.status).toBe("rechazado");
  });

  test("Un usuario normal NO ve el curso en revisión de otro autor (404)", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [baseCurso("revision")] })
      .mockResolvedValueOnce({ rows: [{ role: "user" }] });

    await expect(courseService.obtenerCursoPorId(9, { id: "uuid-otro" })).rejects.toMatchObject({ status: 404 });
  });
});

/* ─────────────────────────────────────────
   FLUJO EDITORIAL: aprobación/rechazo admin
───────────────────────────────────────── */
describe("POST /api/admin/courses/:id/aprobar", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Aprobar publica el curso y envía el correo al autor", async () => {
    pool.query
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 5, instructor_id: "uuid-1", title: "Curso A", status: "revision" }] })
      .mockResolvedValueOnce({ rows: [{ name: "Ana", email: "ana@correo.com" }] });

    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.aprobarCurso({ params: { id: "5" } }, res);

    const update = pool.query.mock.calls[0];
    expect(update[0]).toContain("status = 'activo'");
    expect(update[1]).toEqual([5]);
    expect(emailService.enviarCursoAprobado).toHaveBeenCalledWith({
      to: "ana@correo.com",
      name: "Ana",
      courseTitle: "Curso A",
      courseId: 5,
    });
    expect(res.json).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Aprobar un curso inexistente responde 404", async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.aprobarCurso({ params: { id: "999" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("POST /api/admin/courses/:id/rechazar", () => {
  beforeEach(() => jest.clearAllMocks());

  test("Rechazar guarda el motivo y envía el correo de rechazo", async () => {
    pool.query
      .mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 6, instructor_id: "uuid-2", title: "Curso B", status: "rechazado", rejection_reason: "Contenido duplicado" }],
      })
      .mockResolvedValueOnce({ rows: [{ name: "Luis", email: "luis@correo.com" }] });

    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.rechazarCurso({ params: { id: "6" }, body: { motivo: "Contenido duplicado" } }, res);

    const update = pool.query.mock.calls[0];
    expect(update[0]).toContain("status = 'rechazado'");
    expect(update[1]).toEqual([6, "Contenido duplicado"]);
    expect(emailService.enviarCursoRechazado).toHaveBeenCalledWith(
      expect.objectContaining({ motivo: "Contenido duplicado" })
    );
    expect(res.json).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("id inválido responde 400", async () => {
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.rechazarCurso({ params: { id: "abc" }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("motivo demasiado largo responde 400", async () => {
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.rechazarCurso(
      { params: { id: "6" }, body: { motivo: "x".repeat(1001) } },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });
});