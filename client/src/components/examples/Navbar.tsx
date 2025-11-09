import Navbar from "../Navbar";
import { AuthProvider } from "@/lib/auth-context";
import type { User } from "@shared/schema";

export default function NavbarExample() {
  const mockUser: User = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "",
    role: "citizen",
    phone: null,
    address: null,
    createdAt: new Date(),
  };

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8">
          <p className="text-muted-foreground">Navbar with mock user logged in</p>
        </div>
      </div>
    </AuthProvider>
  );
}
