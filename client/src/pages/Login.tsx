import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { LogIn } from "lucide-react";
import authBg from "@assets/generated_images/Authentication_page_background_ec8b9893.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        form.setError("root", { message: error.error || "Login failed" });
        setIsLoading(false);
        return;
      }

      const { user, token } = await response.json();
      login(user, token);
      
      if (user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    } catch (error) {
      form.setError("root", { message: "Network error. Please try again." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
                GA
              </div>
              <span className="font-bold text-2xl">GRIEV-AI</span>
            </div>
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {form.formState.errors.root && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                    {form.formState.errors.root.message}
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          data-testid="input-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? "Signing in..." : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <button
                className="text-primary font-semibold hover:underline"
                onClick={() => setLocation("/register")}
                data-testid="link-register"
              >
                Sign up
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div
        className="hidden lg:flex flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${authBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-background/30 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-foreground">
          <h2 className="text-4xl font-bold mb-4">Smart Grievance Management</h2>
          <p className="text-lg text-foreground/90 mb-6">
            Empowering citizens to report issues and enabling government to respond faster with AI-driven insights.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-primary/20 p-1 rounded-full mt-1">
                <div className="bg-primary w-2 h-2 rounded-full" />
              </div>
              <span>Fast complaint filing and tracking</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary/20 p-1 rounded-full mt-1">
                <div className="bg-primary w-2 h-2 rounded-full" />
              </div>
              <span>AI-powered categorization and routing</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary/20 p-1 rounded-full mt-1">
                <div className="bg-primary w-2 h-2 rounded-full" />
              </div>
              <span>Real-time status updates</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
