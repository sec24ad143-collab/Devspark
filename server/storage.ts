import { randomUUID } from "crypto";
import type { User, InsertUser, Grievance, InsertGrievance } from "@shared/schema";
import { db } from "./db";
import { users, grievances } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getGrievance(id: string): Promise<Grievance | undefined>;
  getGrievances(filters?: { userId?: string; status?: string; category?: string }): Promise<Grievance[]>;
  createGrievance(grievance: InsertGrievance): Promise<Grievance>;
  updateGrievance(id: string, updates: Partial<Grievance>): Promise<Grievance | undefined>;
  deleteGrievance(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getGrievance(id: string): Promise<Grievance | undefined> {
    const result = await db.select().from(grievances).where(eq(grievances.id, id)).limit(1);
    return result[0];
  }

  async getGrievances(filters?: { userId?: string; status?: string; category?: string }): Promise<Grievance[]> {
    let query = db.select().from(grievances);

    const conditions = [];
    if (filters?.userId) {
      conditions.push(eq(grievances.userId, filters.userId));
    }
    if (filters?.status) {
      conditions.push(eq(grievances.status, filters.status as any));
    }
    if (filters?.category) {
      conditions.push(eq(grievances.category, filters.category as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return query.orderBy(desc(grievances.createdAt));
  }

  async createGrievance(insertGrievance: InsertGrievance): Promise<Grievance> {
    const result = await db.insert(grievances).values(insertGrievance).returning();
    return result[0];
  }

  async updateGrievance(id: string, updates: Partial<Grievance>): Promise<Grievance | undefined> {
    const result = await db
      .update(grievances)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(grievances.id, id))
      .returning();
    return result[0];
  }

  async deleteGrievance(id: string): Promise<boolean> {
    const result = await db.delete(grievances).where(eq(grievances.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
