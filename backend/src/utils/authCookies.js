const { randomUUID } = require("crypto");

const ACCESS_COOKIE = "access_token";
const SESSION_COOKIE = "session_id";

const parse = (cookieHeader = "") => {
  const list = {};
  if (!cookieHeader || typeof cookieHeader !== "string") return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      try {
        list[name] = decodeURIComponent(val);
      } catch {
        list[name] = val;
      }
    }
  });
  return list;
};

const serialize = (name, val, options = {}) => {
  const encName = encodeURIComponent(name);
  const encVal = encodeURIComponent(val || "");
  let str = `${encName}=${encVal}`;

  if (options.maxAge != null) {
    str += `; Max-Age=${Math.floor(options.maxAge)}`;
  }
  if (options.domain) {
    str += `; Domain=${options.domain}`;
  }
  if (options.path) {
    str += `; Path=${options.path}`;
  }
  if (options.expires) {
    str += `; Expires=${options.expires.toUTCString()}`;
  }
  if (options.httpOnly) {
    str += `; HttpOnly`;
  }
  if (options.secure) {
    str += `; Secure`;
  }
  if (options.sameSite) {
    const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
    if (sameSite === true || sameSite === "strict") {
      str += `; SameSite=Strict`;
    } else if (sameSite === "lax") {
      str += `; SameSite=Lax`;
    } else if (sameSite === "none") {
      str += `; SameSite=None`;
    }
  }

  return str;
};

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge,
});

const setAuthCookies = (res, accessToken, sessionId) => {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const resolvedSessionId = sessionId && UUID_REGEX.test(sessionId) ? sessionId : randomUUID();

  res.setHeader("Set-Cookie", [
    serialize(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60)),
    serialize(SESSION_COOKIE, resolvedSessionId, cookieOptions(7 * 24 * 60 * 60)),
  ]);

  return resolvedSessionId;
};

const clearAuthCookies = (res) => {
  res.setHeader("Set-Cookie", [
    serialize(ACCESS_COOKIE, "", { ...cookieOptions(0), expires: new Date(0) }),
    serialize(SESSION_COOKIE, "", { ...cookieOptions(0), expires: new Date(0) }),
  ]);
};

const getAuthCookies = (req) => parse(req.headers.cookie || "");

module.exports = {
  ACCESS_COOKIE,
  SESSION_COOKIE,
  setAuthCookies,
  clearAuthCookies,
  getAuthCookies,
  parse,
  serialize,
};
