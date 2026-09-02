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
    stringifySetCookie({ name: ACCESS_COOKIE, value: String(accessToken), ...cookieOptions(15 * 60) }),
    stringifySetCookie({ name: SESSION_COOKIE, value: String(resolvedSessionId), ...cookieOptions(7 * 24 * 60 * 60) }),
  ]);

  return resolvedSessionId;
};

const clearAuthCookies = (res) => {
  res.setHeader("Set-Cookie", [
    stringifySetCookie({ name: ACCESS_COOKIE, value: "", ...cookieOptions(0), expires: new Date(0) }),
    stringifySetCookie({ name: SESSION_COOKIE, value: "", ...cookieOptions(0), expires: new Date(0) }),
  ]);
};

const getAuthCookies = (req) => {
  try {
    return parseCookie(req.headers.cookie || "");
  } catch (error) {
    return {}; // parseCookie returns an Object in cookie@2.x
  }
};

module.exports = {
  ACCESS_COOKIE,
  SESSION_COOKIE,
  setAuthCookies,
  clearAuthCookies,
  getAuthCookies,
};
