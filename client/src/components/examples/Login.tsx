import Login from "../../pages/Login";
import { AuthProvider } from "@/lib/auth-context";

export default function LoginExample() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}
