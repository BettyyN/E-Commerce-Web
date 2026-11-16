import { http, HttpResponse } from "msw";

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNum: string;
  tin: string;
  password: string;
}

const b64url = (obj: unknown) =>
  btoa(JSON.stringify(obj))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const makeJwt = (claims: Record<string, unknown>) =>
  `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(claims)}.mock-signature`;

const users = [
  {
    id: "1",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    isActive: true,
  },
  {
    id: "2",
    email: "sales@gmail.com",
    password: "sales123",
    role: "emp",
    empId: "e-100",
    isActive: true,
  },
  {
    id: "3",
    email: "user@gmail.com",
    password: "user123",
    role: "cust",
    custId: "c-100",
    isActive: true,
  },
];

const generateToken = (u: (typeof users)[number]) =>
  makeJwt({
    uId: u.id,
    stat: String(u.isActive === true ? "True" : "False"),
    un: u.email,
    r: u.role,
    ...("empId" in u && { eId: u.empId }),
    ...("custId" in u && { cId: u.custId }),
    exp: Math.floor(Date.now() / 1000) + 120,
    iss: "EluTra.Svc.Auth",
    aud: "EluTra",
  });

const generateRefreshToken = (userId: string) =>
  `mock-refresh-token-${userId}-${Date.now()}`;

export const authHandlers = [
  /* =========================================
     LOGIN
  ========================================= */

  http.post("http://localhost:1212/auth/v1/Login", async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    const user = users.find(
      (item) => item.email === body.username && item.password === body.password,
    );

    if (!user) {
      return HttpResponse.json(
        {
          type: "https://example.com/errors/invalid-credentials",
          title: "Invalid credentials",
          status: 401,
          detail: "Username or password is incorrect.",
          instance: "/auth/v1/Login",
        },
        {
          status: 401,
        },
      );
    }

    if (!user.isActive) {
      return HttpResponse.json(
        {
          type: "https://example.com/errors/inactive-account",
          title: "Account inactive",
          status: 403,
          detail: "Your account is inactive.",
          instance: "/auth/v1/Login",
        },
        {
          status: 403,
        },
      );
    }

    return HttpResponse.json({
      data: {
        accessToken: generateToken(user),
        refreshToken: generateRefreshToken(user.id),
        expiresDate: new Date(Date.now() + 120 * 1000).toISOString(),
      },
    });
  }),

  /* =========================================
     REFRESH TOKEN
  ========================================= */

  http.post(
    "http://localhost:1212/auth/v1/RefreshToken",
    async ({ request }) => {
      const body = (await request.json()) as {
        token: string;
      };

      if (!body.token) {
        return HttpResponse.json(
          {
            type: "https://example.com/errors/invalid-token",
            title: "Invalid refresh token",
            status: 401,
            detail: "Refresh token is required.",
            instance: "/auth/v1/RefreshToken",
          },
          {
            status: 401,
          },
        );
      }

      const userId = body.token.split("-")[3]; // "mock-refresh-token-<id>-<time>"
      const user = users.find((u) => u.id === userId) ?? users[0];

      return HttpResponse.json({
        data: {
          accessToken: generateToken(user),
          refreshToken: generateRefreshToken(user.id),
          expiresDate: new Date(Date.now() + 120 * 1000).toISOString(),
        },
      });
    },
  ),

  /* =========================================
     REGISTER
  ========================================= */

  http.post("http://localhost:1212/auth/v1/Register", async ({ request }) => {
    const body = (await request.json()) as RegisterRequest;

    const existingUser = users.find((user) => user.email === body.email);

    if (existingUser) {
      return HttpResponse.json(
        {
          type: "https://example.com/errors/email-exists",
          title: "Registration failed",
          status: 400,
          detail: "An account with this email already exists.",
          instance: "/auth/v1/Register",
        },
        {
          status: 400,
        },
      );
    }

    const newUser = {
      id: String(users.length + 1),
      fullName: body.fullName,
      email: body.email,
      password: body.password,
      role: "Customer",
      custId: `c-${100 + users.length}`,
      isActive: false,
    };

    users.push(newUser);

    return HttpResponse.json(
      {
        data: {
          userId: newUser.id,
        },
      },
      {
        status: 201,
      },
    );
  }),
];
