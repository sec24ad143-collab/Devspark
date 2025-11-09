import StatusBadge from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-4">
        <StatusBadge status="Pending" />
        <StatusBadge status="In Progress" />
        <StatusBadge status="Resolved" />
      </div>
    </div>
  );
}
