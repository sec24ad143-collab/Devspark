import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import CategoryIcon from "@/components/CategoryIcon";
import { Send, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const grievanceSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  category: z.enum(["Water", "Power", "Roads", "Sanitation", "Public Safety", "Healthcare", "Education", "Other"]),
  location: z.string().min(5, "Please provide a detailed location"),
});

type GrievanceFormData = z.infer<typeof grievanceSchema>;

const categories = [
  { value: "Water", label: "Water Supply", description: "Leaks, shortages, quality issues" },
  { value: "Power", label: "Power & Electricity", description: "Outages, street lights, maintenance" },
  { value: "Roads", label: "Roads & Infrastructure", description: "Potholes, repairs, traffic issues" },
  { value: "Sanitation", label: "Sanitation & Waste", description: "Garbage collection, cleanliness" },
  { value: "Public Safety", label: "Public Safety", description: "Security, safety concerns" },
  { value: "Healthcare", label: "Healthcare", description: "Medical facilities, ambulances" },
  { value: "Education", label: "Education", description: "Schools, facilities, resources" },
  { value: "Other", label: "Other Issues", description: "Any other civic concerns" },
];

export default function GrievanceForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<GrievanceFormData>({
    resolver: zodResolver(grievanceSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      location: "",
    },
  });

  const createGrievance = useMutation({
    mutationFn: async (data: GrievanceFormData) => {
      return apiRequest("/api/grievances", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grievances"] });
      toast({
        title: "Grievance Submitted Successfully",
        description: "Your complaint has been registered and will be reviewed shortly.",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit grievance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: GrievanceFormData) => {
    createGrievance.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
          <p className="text-muted-foreground text-lg">
            Help us serve you better by reporting civic issues in your area
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grievance Details</CardTitle>
            <CardDescription>
              Please provide detailed information about the issue you're experiencing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormDescription>
                        Select the category that best describes your issue
                      </FormDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {categories.map((cat) => (
                          <div
                            key={cat.value}
                            onClick={() => field.onChange(cat.value)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover-elevate ${
                              field.value === cat.value
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                            data-testid={`category-${cat.value.toLowerCase()}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                                <CategoryIcon category={cat.value} className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{cat.label}</p>
                                <p className="text-sm text-muted-foreground">{cat.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief description of the issue"
                          data-testid="input-title"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, concise title helps us categorize and prioritize your issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide as much detail as possible about the issue..."
                          className="min-h-32"
                          data-testid="input-description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include when the problem started, its severity, and any relevant details
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            placeholder="Street address, landmark, or area name"
                            className="pl-10"
                            data-testid="input-location"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Be as specific as possible to help us locate the issue quickly
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createGrievance.isPending}
                    data-testid="button-submit"
                  >
                    {createGrievance.isPending ? "Submitting..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Grievance
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
