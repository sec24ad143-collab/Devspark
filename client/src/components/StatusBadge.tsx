import { Badge } from "@/components/ui/badge";
import { Clock, Settings, CheckCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "Pending" | "In Progress" | "Resolved";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    Pending: {
      variant: "secondary" as const,
      icon: Clock,
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    "In Progress": {
      variant: "secondary" as const,
      icon: Settings,
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    },
    Resolved: {
      variant: "secondary" as const,
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    },
  };

  const { icon: Icon, className } = config[status];

  return (
    <Badge className={`${className} gap-1`}>
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
}
