import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import CategoryIcon from "@/components/CategoryIcon";
import { Search, FileText, Clock, CheckCircle, TrendingUp, Edit } from "lucide-react";
import type { Grievance } from "@shared/schema";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: grievances = [], isLoading } = useQuery<Grievance[]>({
    queryKey: ["/api/grievances"],
  });

  const filteredGrievances = grievances.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         g.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || g.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: grievances.length,
    pending: grievances.filter((g) => g.status === "Pending").length,
    inProgress: grievances.filter((g) => g.status === "In Progress").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
  };

  const categoryData = [
    { name: "Water", value: grievances.filter(g => g.category === "Water").length },
    { name: "Power", value: grievances.filter(g => g.category === "Power").length },
    { name: "Roads", value: grievances.filter(g => g.category === "Roads").length },
    { name: "Sanitation", value: grievances.filter(g => g.category === "Sanitation").length },
    { name: "Public Safety", value: grievances.filter(g => g.category === "Public Safety").length },
  ].filter(cat => cat.value > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage and track all citizen grievances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Complaints"
            value={stats.total}
            icon={FileText}
            trend={{ value: "12% from last month", isPositive: false }}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={TrendingUp}
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle}
            trend={{ value: "23% from last month", isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>All Grievances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="select-category-filter">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Power">Power</SelectItem>
                    <SelectItem value="Roads">Roads</SelectItem>
                    <SelectItem value="Sanitation">Sanitation</SelectItem>
                    <SelectItem value="Public Safety">Public Safety</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Loading grievances...</p>
                </div>
              ) : filteredGrievances.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No grievances found</p>
                </div>
              ) : (
                <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrievances.map((grievance) => (
                      <TableRow key={grievance.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="line-clamp-1">{grievance.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CategoryIcon category={grievance.category} className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{grievance.category}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="line-clamp-1 text-sm text-muted-foreground">{grievance.location}</div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={grievance.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(grievance.createdAt!).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log("Edit grievance:", grievance.id)}
                            data-testid={`button-edit-${grievance.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complaints by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CategoryIcon category={cat.name} className="w-5 h-5 text-primary" />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Resolution Rate</span>
                    <span className="text-sm font-medium">
                      {Math.round((stats.resolved / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">In Progress</span>
                    <span className="text-sm font-medium">
                      {Math.round((stats.inProgress / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="text-sm font-medium">
                      {Math.round((stats.pending / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
