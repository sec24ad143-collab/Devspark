import CitizenDashboard from "../../pages/CitizenDashboard";
import { AuthProvider } from "@/lib/auth-context";

export default function CitizenDashboardExample() {
  return (
    <AuthProvider>
      <CitizenDashboard />
    </AuthProvider>
  );
}
