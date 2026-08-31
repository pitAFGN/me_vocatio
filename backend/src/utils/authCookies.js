const { parse, serialize } = require("cookie");

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.setHeader("Set-Cookie", [
    serialize(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60)),
    serialize(REFRESH_COOKIE, refreshToken, cookieOptions(7 * 24 * 60 * 60)),
  ]);
};

const clearAuthCookies = (res) => {
  res.setHeader("Set-Cookie", [
    serialize(ACCESS_COOKIE, "", { ...cookieOptions(0), expires: new Date(0) }),
    serialize(REFRESH_COOKIE, "", { ...cookieOptions(0), expires: new Date(0) }),
  ]);
};

const getAuthCookies = (req) => parse(req.headers.cookie || "");

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  setAuthCookies,
  clearAuthCookies,
  getAuthCookies,
};
