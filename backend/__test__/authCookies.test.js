const { setAuthCookies, clearAuthCookies, SESSION_COOKIE } = require("../src/utils/authCookies");

describe("authCookies", () => {
  test("no debe enviar el refresh token como cookie en el navegador", () => {
    const res = {
      setHeader: jest.fn(),
    };

    setAuthCookies(res, "access-token-value", "refresh-token-value");

    const cookies = res.setHeader.mock.calls[0][1];
    const cookieHeader = cookies.join("; ");

    expect(cookieHeader).toContain("access_token=access-token-value");
    expect(cookieHeader).toContain(`${SESSION_COOKIE}=`);
    expect(cookieHeader).not.toContain("refresh_token=");
    expect(cookieHeader).not.toContain("refresh-token-value");
  });

  test("clearAuthCookies debe limpiar la sesión del navegador", () => {
    const res = {
      setHeader: jest.fn(),
    };

    clearAuthCookies(res);

    const cookies = res.setHeader.mock.calls[0][1];
    const cookieHeader = cookies.join("; ");

    expect(cookieHeader).toContain("access_token=");
    expect(cookieHeader).toContain(`${SESSION_COOKIE}=`);
  });
});
