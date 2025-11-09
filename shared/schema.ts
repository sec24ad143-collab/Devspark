import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["citizen", "admin"] }).notNull().default("citizen"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const grievances = pgTable("grievances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", {
    enum: ["Water", "Power", "Roads", "Sanitation", "Public Safety", "Healthcare", "Education", "Other"],
  }).notNull(),
  location: text("location").notNull(),
  status: text("status", {
    enum: ["Pending", "In Progress", "Resolved"],
  }).notNull().default("Pending"),
  department: text("department"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGrievanceSchema = createInsertSchema(grievances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  department: true,
  adminNotes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGrievance = z.infer<typeof insertGrievanceSchema>;
export type Grievance = typeof grievances.$inferSelect;
