import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import CategoryIcon from "./CategoryIcon";
import { MapPin, Calendar } from "lucide-react";
import type { Grievance } from "@shared/schema";

interface GrievanceCardProps {
  grievance: Grievance;
  onView?: () => void;
}

export default function GrievanceCard({ grievance, onView }: GrievanceCardProps) {
  return (
    <Card className="hover-elevate transition-all">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
            <CategoryIcon category={grievance.category} className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-1">{grievance.title}</h3>
            <p className="text-sm text-muted-foreground">{grievance.category}</p>
          </div>
        </div>
        <StatusBadge status={grievance.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground line-clamp-2">{grievance.description}</p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{grievance.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(grievance.createdAt!).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onView}
          data-testid={`button-view-grievance-${grievance.id}`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
