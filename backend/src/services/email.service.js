const transporter = require("../config/mailer");

/* ─────────────────────────────────────────
   Correos del flujo editorial de cursos
───────────────────────────────────────── */

const plantillaBase = ({ titulo, contenido, link, linkTexto }) => `
  <div style="font-family:Segoe UI, Arial, sans-serif; background:#0f172a; padding:40px 20px;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden;">
      <div style="background:#0f172a; padding:28px 32px; text-align:center;">
        <span style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">MeVocatio</span>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#0f172a; margin:0 0 12px;">${titulo}</h2>
        ${contenido}
        ${
          link
            ? `<div style="text-align:center; margin:0 0 24px;">
                <a href="${link}"
                   style="background:#8b5cf6; color:#ffffff; padding:14px 32px; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px; display:inline-block;">
                   ${linkTexto}
                </a>
              </div>`
            : ""
        }
        <p style="color:#94a3b8; font-size:13px; line-height:1.5; margin:0;">
          MeVocatio — Orientación vocacional para encontrar tu camino
        </p>
      </div>
    </div>
    <p style="text-align:center; color:#64748b; font-size:12px; margin-top:20px;">
      MeVocatio — Orientación vocacional para encontrar tu camino
    </p>
  </div>
`;

const enviarCursoAprobado = async ({ to, name, courseTitle, courseId }) => {
  const link = `${process.env.FRONTEND_URL}/curso/${courseId}`;

  await transporter.sendMail({
    from: `"MeVocatio" <${process.env.EMAIL_USER}>`,
    to,
    subject: "¡Tu curso fue aprobado! 🎉 — MeVocatio",
    html: plantillaBase({
      titulo: `¡Buenas, ${name}! 🎉`,
      contenido: `
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 20px;">
          ¡Tu curso <strong>"${courseTitle}"</strong> fue <strong style="color:#059669;">aprobado</strong> y
          ya está disponible en el catálogo para todos los estudiantes.
        </p>
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 24px;">
          Comparte el enlace y empieza a guiar a quienes buscan su vocación.
        </p>
      `,
      link,
      linkTexto: "Ver mi curso",
    }),
  });
};

const enviarCursoRechazado = async ({ to, name, courseTitle, courseId, motivo }) => {
  const link = `${process.env.FRONTEND_URL}/creacion_recursos?editar=${courseId}`;

  await transporter.sendMail({
    from: `"MeVocatio" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Tu curso no fue aprobado — MeVocatio",
    html: plantillaBase({
      titulo: `Hola, ${name} ⚠️`,
      contenido: `
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 20px;">
          Tu curso <strong>"${courseTitle}"</strong> no pasó la revisión editorial.
        </p>
        ${
          motivo
            ? `<div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:16px 18px; margin:0 0 20px;">
                <p style="color:#b91c1c; font-size:13px; font-weight:700; margin:0 0 6px;">Motivo del rechazo</p>
                <p style="color:#7f1d1d; font-size:14px; line-height:1.6; margin:0;">${motivo}</p>
              </div>`
            : ""
        }
        <p style="color:#475569; font-size:15px; line-height:1.6; margin:0 0 24px;">
          Ajusta el contenido según el motivo y vuelve a enviarlo a revisión. ¡Estamos aquí para ayudarte a crear algo increíble!
        </p>
      `,
      link,
      linkTexto: "Editar mi curso",
    }),
  });
};

/* Las funciones nunca lanzan si el correo falla: la aprobación en sí
   ya se guardó en la BD y el error de correo no debe romper la respuesta. */
const correrConGuardia = (fn) =>
  fn().catch((error) => {
    console.error("Error enviando correo editorial:", error.message);
  });

module.exports = {
  enviarCursoAprobado: (opts) => correrConGuardia(() => enviarCursoAprobado(opts)),
  enviarCursoRechazado: (opts) => correrConGuardia(() => enviarCursoRechazado(opts)),
};