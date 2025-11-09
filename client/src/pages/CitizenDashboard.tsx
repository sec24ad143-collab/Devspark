import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import GrievanceCard from "@/components/GrievanceCard";
import { Plus, Search, Filter } from "lucide-react";
import { useLocation } from "wouter";
import type { Grievance } from "@shared/schema";
import heroBg from "@assets/generated_images/Hero_image_civic_engagement_9812aa14.png";

export default function CitizenDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: grievances = [], isLoading } = useQuery<Grievance[]>({
    queryKey: ["/api/grievances"],
  });

  const filteredGrievances = grievances.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: grievances.length,
    pending: grievances.filter((g) => g.status === "Pending").length,
    inProgress: grievances.filter((g) => g.status === "In Progress").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div
        className="relative bg-cover bg-center h-80"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background backdrop-blur-md" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">My Grievances</h1>
          <p className="text-xl text-foreground/90 mb-8 max-w-2xl">
            Track your reported issues and see their resolution progress in real-time
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <div className="bg-card/90 backdrop-blur p-4 rounded-lg border border-card-border">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="bg-card/90 backdrop-blur p-4 rounded-lg border border-card-border">
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="bg-card/90 backdrop-blur p-4 rounded-lg border border-card-border">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="bg-card/90 backdrop-blur p-4 rounded-lg border border-card-border">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search grievances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setLocation("/grievances/new")} data-testid="button-new-grievance">
            <Plus className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Loading grievances...</p>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {grievances.length === 0 ? "No grievances yet" : "No grievances match your filters"}
            </p>
            {grievances.length === 0 && (
              <Button onClick={() => setLocation("/grievances/new")} className="mt-4">
                Report Your First Issue
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrievances.map((grievance) => (
              <GrievanceCard
                key={grievance.id}
                grievance={grievance}
                onView={() => console.log("View grievance:", grievance.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
