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
import { UserPlus } from "lucide-react";
import authBg from "@assets/generated_images/Authentication_page_background_ec8b9893.png";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone || null,
          role: "citizen",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        form.setError("root", { message: error.error || "Registration failed" });
        setIsLoading(false);
        return;
      }

      const { user, token } = await response.json();
      login(user, token);
      setLocation("/dashboard");
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
            <CardTitle className="text-3xl font-bold">Create account</CardTitle>
            <CardDescription>Join us to make your voice heard</CardDescription>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          data-testid="input-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 000-0000"
                          type="tel"
                          data-testid="input-phone"
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          data-testid="input-confirm-password"
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
                  {isLoading ? "Creating account..." : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign up
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground text-center w-full">
              Already have an account?{" "}
              <button
                className="text-primary font-semibold hover:underline"
                onClick={() => setLocation("/login")}
                data-testid="link-login"
              >
                Sign in
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
          <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
          <p className="text-lg text-foreground/90 mb-6">
            Help build a better community by reporting issues and tracking their resolution in real-time.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-primary/20 p-1 rounded-full mt-1">
                <div className="bg-primary w-2 h-2 rounded-full" />
              </div>
              <span>Submit grievances anytime, anywhere</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary/20 p-1 rounded-full mt-1">
                <div className="bg-primary w-2 h-2 rounded-full" />
              </div>
              <span>Track resolution progress transparently</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary/20 p-1 rounded-full mt-1">
                <div className="bg-primary w-2 h-2 rounded-full" />
              </div>
              <span>Contribute to community insights</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
