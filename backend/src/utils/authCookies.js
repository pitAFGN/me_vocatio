const { parse, serialize } = require("cookie");
const { parseCookie, stringifySetCookie } = require("cookie");
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
  const resolvedSessionId = sessionId || randomUUID();

  res.setHeader("Set-Cookie", [
    serialize(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60)),
    serialize(REFRESH_COOKIE, refreshToken, cookieOptions(7 * 24 * 60 * 60)),
    stringifySetCookie({ name: ACCESS_COOKIE, value: accessToken, ...cookieOptions(15 * 60) }),
    stringifySetCookie({ name: SESSION_COOKIE, value: resolvedSessionId, ...cookieOptions(7 * 24 * 60 * 60) }),
  ]);

  return resolvedSessionId;
};

const clearAuthCookies = (res) => {
  res.setHeader("Set-Cookie", [
    serialize(ACCESS_COOKIE, "", { ...cookieOptions(0), expires: new Date(0) }),
    serialize(REFRESH_COOKIE, "", { ...cookieOptions(0), expires: new Date(0) }),
    stringifySetCookie({ name: ACCESS_COOKIE, value: "", ...cookieOptions(0), expires: new Date(0) }),
    stringifySetCookie({ name: SESSION_COOKIE, value: "", ...cookieOptions(0), expires: new Date(0) }),
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
