import GrievanceCard from "../GrievanceCard";
import type { Grievance } from "@shared/schema";

export default function GrievanceCardExample() {
  const sampleGrievance: Grievance = {
    id: "1",
    userId: "user1",
    title: "Water leakage on Main Street",
    description: "There is a major water pipe leak near the Main Street junction causing water wastage and road damage.",
    category: "Water",
    location: "Main Street, Ward 4, Near City Mall",
    status: "In Progress",
    department: "Water Department",
    adminNotes: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
  };

  return (
    <div className="p-8 max-w-md">
      <GrievanceCard
        grievance={sampleGrievance}
        onView={() => console.log("View grievance:", sampleGrievance.id)}
      />
    </div>
  );
}
