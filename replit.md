# GRIEV-AI Platform

## Overview

GRIEV-AI is a modern civic grievance management platform that enables citizens to report and track civic issues while providing government administrators with tools to manage, analyze, and resolve complaints efficiently. The platform combines a citizen-facing dashboard for complaint submission and tracking with an administrative interface for complaint management and departmental coordination.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing instead of React Router

**UI Component Strategy**
- Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design foundation with Linear-inspired dashboard aesthetics per design guidelines
- Custom theming system supporting light/dark modes through CSS variables

**State Management**
- React Context API for authentication state (AuthProvider/useAuth)
- TanStack Query (React Query) for server state management, caching, and data fetching
- React Hook Form with Zod for form state and validation

**Design System**
- Typography: Inter for headings/UI, Open Sans for body text
- Color system: HSL-based with CSS custom properties for theme flexibility
- Spacing: Tailwind's 4px-based scale (4, 6, 8, 12, 16, 20, 24)
- Components follow "New York" style variant from Shadcn

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript for type safety
- ESM module system throughout the codebase
- Middleware-based request processing pipeline

**API Design**
- RESTful API architecture with `/api` prefix for all endpoints
- Role-based access control through custom middleware (authenticate, requireRole)
- JWT-based authentication with bcrypt password hashing
- Request/response logging middleware for debugging and monitoring

**Authentication Flow**
- Stateless JWT tokens stored in localStorage on client
- Bearer token authentication via Authorization header
- Password hashing using bcrypt with 10 salt rounds
- 7-day token expiration with user claims (id, email, role)

### Database Layer

**ORM & Database**
- Drizzle ORM for type-safe database queries and migrations
- PostgreSQL as the primary database (via Neon serverless)
- WebSocket-based connection pooling for serverless environments

**Schema Design**
- Users table: Supports citizen and admin roles with optional contact information
- Grievances table: Complaint tracking with status workflow (Pending → In Progress → Resolved)
- UUID primary keys using PostgreSQL's gen_random_uuid()
- Timestamps for audit trail (createdAt, updatedAt)

**Data Access Pattern**
- Storage abstraction layer (IStorage interface) for database operations
- Separation of concerns: routes handle HTTP, storage handles data persistence
- Schema validation using Drizzle-Zod integration

### External Dependencies

**Third-Party Services**
- Neon Database: Serverless PostgreSQL hosting with WebSocket support
- Google Fonts: Inter and Open Sans font families

**Key NPM Packages**
- Authentication: jsonwebtoken, bcrypt
- Database: @neondatabase/serverless, drizzle-orm, drizzle-kit
- UI Components: @radix-ui/* (complete suite of headless components)
- Forms: react-hook-form, @hookform/resolvers, zod
- Utilities: clsx, tailwind-merge, class-variance-authority
- Date handling: date-fns
- Icons: lucide-react

**Development Tools**
- tsx for TypeScript execution in development
- esbuild for production server bundling
- Replit-specific plugins for development environment integration

### Application Structure

**Client-Side Organization**
- `/client/src/pages`: Route components (Login, Register, CitizenDashboard, AdminDashboard, GrievanceForm, Profile)
- `/client/src/components`: Reusable UI components (Navbar, GrievanceCard, StatsCard, StatusBadge, CategoryIcon)
- `/client/src/components/ui`: Shadcn UI primitives
- `/client/src/lib`: Utilities (auth-context, queryClient, utils)
- `/client/src/hooks`: Custom React hooks

**Server-Side Organization**
- `/server/routes.ts`: API endpoint definitions
- `/server/storage.ts`: Database access layer
- `/server/middleware`: Authentication and authorization middleware
- `/server/lib`: Utility functions (auth helpers)

**Shared Code**
- `/shared/schema.ts`: Database schema definitions and Zod validators shared between client and server

### Security Considerations

**Authentication Security**
- Passwords hashed with bcrypt before storage
- JWT tokens with expiration for session management
- Role-based access control preventing unauthorized access
- Protected routes redirect unauthenticated users to login

**Data Validation**
- Zod schemas validate all user inputs on both client and server
- Type safety enforced through TypeScript
- SQL injection prevention through Drizzle ORM's parameterized queries