import AdminDashboard from "../../pages/AdminDashboard";
import { AuthProvider } from "@/lib/auth-context";

export default function AdminDashboardExample() {
  return (
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  );
}
