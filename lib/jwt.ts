import * as jose from "jose";

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || ""
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || ""
);

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export type JWTPayloadT = {
  userId: string;
  email: string;
};

export async function generateAccessToken(payload: JWTPayloadT) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
    .sign(ACCESS_SECRET);
}

export async function generateRefreshToken(payload: JWTPayloadT) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, ACCESS_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, REFRESH_SECRET);
    return payload;
  } catch {
    return null;
  }
}
