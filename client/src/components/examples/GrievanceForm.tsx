import GrievanceForm from "../../pages/GrievanceForm";
import { AuthProvider } from "@/lib/auth-context";

export default function GrievanceFormExample() {
  return (
    <AuthProvider>
      <GrievanceForm />
    </AuthProvider>
  );
}
