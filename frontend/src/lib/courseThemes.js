export const COURSE_THEME_CLASSES = {
  "bg-slate-950": "bg-slate-100 dark:bg-slate-950",
  "bg-violet-900/80": "bg-violet-100 dark:bg-violet-900/80",
  "bg-gradient-to-br from-sky-900 via-indigo-950 to-slate-950":
    "bg-gradient-to-br from-sky-100 via-indigo-100 to-slate-100 dark:bg-gradient-to-br dark:from-sky-900 dark:via-indigo-950 dark:to-slate-950",
  "bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950":
    "bg-gradient-to-br from-slate-100 via-violet-100 to-indigo-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-violet-950 dark:to-indigo-950",
};

const limpiarUrl = (valor) => valor.replace(/["'\\\n\r]/g, "");

export function resolveCourseBackground(backgroundStyle) {
  const valor = backgroundStyle || "bg-slate-950";

  if (COURSE_THEME_CLASSES[valor]) {
    return { className: COURSE_THEME_CLASSES[valor], isImage: false, url: null };
  }

  if (/^https?:\/\/\S+$/i.test(valor)) {
    return { className: "", isImage: true, url: limpiarUrl(valor) };
  }

  return { className: "bg-white dark:bg-slate-900", isImage: false, url: null };
}