import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, getUserWithoutPassword } from "./lib/auth";
import { authenticate, requireRole, type AuthRequest } from "./middleware/auth";
import { insertUserSchema, insertGrievanceSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const updateGrievanceSchema = z.object({
  status: z.enum(["Pending", "In Progress", "Resolved"]).optional(),
  department: z.string().optional(),
  adminNotes: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
        role: data.role || "citizen",
      });

      const token = generateToken(user);
      const userWithoutPassword = getUserWithoutPassword(user);

      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await comparePassword(data.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user);
      const userWithoutPassword = getUserWithoutPassword(user);

      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticate, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userWithoutPassword = getUserWithoutPassword(user);
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/grievances", authenticate, async (req: AuthRequest, res) => {
    try {
      const filters: { userId?: string; status?: string; category?: string } = {};

      if (req.user!.role === "citizen") {
        filters.userId = req.user!.id;
      }

      if (req.query.status) {
        filters.status = req.query.status as string;
      }

      if (req.query.category) {
        filters.category = req.query.category as string;
      }

      const grievances = await storage.getGrievances(filters);
      res.json(grievances);
    } catch (error) {
      console.error("Get grievances error:", error);
      res.status(500).json({ error: "Failed to fetch grievances" });
    }
  });

  app.get("/api/grievances/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const grievance = await storage.getGrievance(req.params.id);
      
      if (!grievance) {
        return res.status(404).json({ error: "Grievance not found" });
      }

      if (req.user!.role === "citizen" && grievance.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(grievance);
    } catch (error) {
      console.error("Get grievance error:", error);
      res.status(500).json({ error: "Failed to fetch grievance" });
    }
  });

  app.post("/api/grievances", authenticate, requireRole("citizen"), async (req: AuthRequest, res) => {
    try {
      const data = insertGrievanceSchema.omit({ userId: true }).parse(req.body);
      
      const grievance = await storage.createGrievance({
        ...data,
        userId: req.user!.id,
      });

      res.status(201).json(grievance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Create grievance error:", error);
      res.status(500).json({ error: "Failed to create grievance" });
    }
  });

  app.patch("/api/grievances/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const grievance = await storage.getGrievance(req.params.id);
      
      if (!grievance) {
        return res.status(404).json({ error: "Grievance not found" });
      }

      if (req.user!.role === "citizen") {
        if (grievance.userId !== req.user!.id) {
          return res.status(403).json({ error: "Access denied" });
        }
        const citizenUpdate = insertGrievanceSchema.partial().parse(req.body);
        const updated = await storage.updateGrievance(req.params.id, citizenUpdate);
        return res.json(updated);
      }

      if (req.user!.role === "admin") {
        const adminUpdate = updateGrievanceSchema.parse(req.body);
        const updated = await storage.updateGrievance(req.params.id, adminUpdate);
        return res.json(updated);
      }

      res.status(403).json({ error: "Access denied" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Update grievance error:", error);
      res.status(500).json({ error: "Failed to update grievance" });
    }
  });

  app.delete("/api/grievances/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const grievance = await storage.getGrievance(req.params.id);
      
      if (!grievance) {
        return res.status(404).json({ error: "Grievance not found" });
      }

      if (req.user!.role === "citizen" && grievance.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      const deleted = await storage.deleteGrievance(req.params.id);
      
      if (deleted) {
        res.json({ message: "Grievance deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete grievance" });
      }
    } catch (error) {
      console.error("Delete grievance error:", error);
      res.status(500).json({ error: "Failed to delete grievance" });
    }
  });

  app.get("/api/stats", authenticate, requireRole("admin"), async (req: AuthRequest, res) => {
    try {
      const allGrievances = await storage.getGrievances();
      
      const stats = {
        total: allGrievances.length,
        pending: allGrievances.filter(g => g.status === "Pending").length,
        inProgress: allGrievances.filter(g => g.status === "In Progress").length,
        resolved: allGrievances.filter(g => g.status === "Resolved").length,
        byCategory: {} as Record<string, number>,
      };

      allGrievances.forEach(g => {
        stats.byCategory[g.category] = (stats.byCategory[g.category] || 0) + 1;
      });

      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
