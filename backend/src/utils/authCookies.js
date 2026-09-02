const { parse, serialize } = require("cookie");
const { randomUUID } = require("crypto");

const ACCESS_COOKIE = "access_token";
const SESSION_COOKIE = "session_id";

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
};
