import Profile from "../../pages/Profile";
import { AuthProvider } from "@/lib/auth-context";

export default function ProfileExample() {
  return (
    <AuthProvider>
      <Profile />
    </AuthProvider>
  );
}
