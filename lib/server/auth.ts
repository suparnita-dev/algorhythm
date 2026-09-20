import {
  createHmac,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE = "algocraft_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const AUTH_SECRET = process.env.AUTH_SECRET ?? "local-development-secret-change-me";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

declare global {
  var algocraftUsers: Map<string, UserRecord> | undefined;
}

const users = globalThis.algocraftUsers ?? new Map<string, UserRecord>();
globalThis.algocraftUsers = users;

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", AUTH_SECRET).update(value).digest("base64url");
}

function makeSession(userId: string) {
  const payload: SessionPayload = {
    userId,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function parseSession(token: string | undefined) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(decode(encoded)) as SessionPayload;
    return payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, storedKey] = storedHash.split(":");
  if (!salt || !storedKey) return false;
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(storedKey, "hex");
  return storedBuffer.length === derivedKey.length && timingSafeEqual(storedBuffer, derivedKey);
}

export function findUserByEmail(email: string) {
  return users.get(email.toLowerCase());
}

export function findUserById(id: string) {
  return [...users.values()].find((user) => user.id === id);
}

export function createUser(input: { name: string; email: string; passwordHash: string }) {
  const user: UserRecord = {
    id: randomBytes(16).toString("hex"),
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.set(user.email, user);
  return user;
}

export function publicUser(user: UserRecord) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export function setSessionCookie(response: Response, userId: string) {
  const cookieValue = makeSession(userId);
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
  );
}

export function clearSessionCookie(response: Response) {
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
  );
}

export function sessionCookieName() {
  return SESSION_COOKIE;
}

export function userFromSession(token: string | undefined) {
  const payload = parseSession(token);
  return payload ? findUserById(payload.userId) : undefined;
}
