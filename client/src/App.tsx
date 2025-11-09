import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CitizenDashboard from "@/pages/CitizenDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import GrievanceForm from "@/pages/GrievanceForm";
import Profile from "@/pages/Profile";

function ProtectedRoute({ component: Component, allowedRoles }: { component: React.ComponentType; allowedRoles?: string[] }) {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Redirect to={user.role === "admin" ? "/admin" : "/dashboard"} />;
  }

  return <Component />;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {() => {
          if (!user) return <Redirect to="/login" />;
          return <Redirect to={user.role === "admin" ? "/admin" : "/dashboard"} />;
        }}
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={CitizenDashboard} allowedRoles={["citizen"]} />}
      </Route>
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/grievances/new">
        {() => <ProtectedRoute component={GrievanceForm} allowedRoles={["citizen"]} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
