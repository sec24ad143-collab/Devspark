import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

export function getUserWithoutPassword(user: User): Omit<User, "password"> {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
