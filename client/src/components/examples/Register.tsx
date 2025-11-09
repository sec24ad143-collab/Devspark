import Register from "../../pages/Register";
import { AuthProvider } from "@/lib/auth-context";

export default function RegisterExample() {
  return (
    <AuthProvider>
      <Register />
    </AuthProvider>
  );
}
