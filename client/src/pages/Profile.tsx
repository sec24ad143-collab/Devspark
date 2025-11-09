import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { User, MapPin, Phone, Mail, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Grievance } from "@shared/schema";
import StatusBadge from "@/components/StatusBadge";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    console.log("Updating profile:", data);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const mockActivityHistory: Grievance[] = [
    {
      id: "1",
      userId: user?.id || "",
      title: "Water leakage on Main Street",
      description: "Major water pipe leak",
      category: "Water",
      location: "Main Street, Ward 4",
      status: "In Progress",
      department: "Water Department",
      adminNotes: null,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "2",
      userId: user?.id || "",
      title: "Broken street lights",
      description: "Street lights not working",
      category: "Power",
      location: "Park Avenue, Ward 2",
      status: "Pending",
      department: null,
      adminNotes: null,
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-18"),
    },
    {
      id: "3",
      userId: user?.id || "",
      title: "Pothole on Highway 5",
      description: "Large pothole",
      category: "Roads",
      location: "Highway 5",
      status: "Resolved",
      department: "PWD",
      adminNotes: "Repaired",
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-10"),
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account information and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-muted-foreground mb-2">{user.email}</p>
                <p className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium capitalize">
                  {user.role}
                </p>
                <div className="w-full mt-6 pt-6 border-t space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {new Date(user.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile" data-testid="tab-profile">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </TabsTrigger>
                  <TabsTrigger value="activity" data-testid="tab-activity">
                    <FileText className="w-4 h-4 mr-2" />
                    Activity History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                    <p className="text-muted-foreground text-sm">
                      Update your personal details and contact information
                    </p>
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                data-testid="input-name"
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
                                {...field}
                                type="email"
                                disabled={!isEditing}
                                data-testid="input-email"
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
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                data-testid="input-address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-4 pt-4">
                        {isEditing ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                form.reset();
                              }}
                              data-testid="button-cancel"
                            >
                              Cancel
                            </Button>
                            <Button type="submit" data-testid="button-save">
                              Save Changes
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            data-testid="button-edit"
                          >
                            Edit Profile
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="activity" className="mt-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
                    <p className="text-muted-foreground text-sm">
                      View all your submitted grievances and their current status
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {mockActivityHistory.map((grievance) => (
                      <Card key={grievance.id} className="hover-elevate transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-semibold line-clamp-1">{grievance.title}</h4>
                                <StatusBadge status={grievance.status} />
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {grievance.category} • {grievance.location}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Filed: {new Date(grievance.createdAt!).toLocaleDateString()}</span>
                                <span>Updated: {new Date(grievance.updatedAt!).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
