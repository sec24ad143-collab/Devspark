import StatsCard from "../StatsCard";
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Complaints"
        value="1,234"
        icon={FileText}
        trend={{ value: "12% from last month", isPositive: false }}
      />
      <StatsCard
        title="Pending"
        value="342"
        icon={Clock}
        trend={{ value: "8% from last month", isPositive: false }}
      />
      <StatsCard
        title="Resolved"
        value="892"
        icon={CheckCircle}
        trend={{ value: "23% from last month", isPositive: true }}
      />
      <StatsCard
        title="Avg. Response Time"
        value="4.2 days"
        icon={TrendingUp}
        trend={{ value: "15% improvement", isPositive: true }}
      />
    </div>
  );
}
