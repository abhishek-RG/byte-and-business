
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "submitted" | "verified" | "funded" | "completed" | "pending" | "failed";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  
  const statusStyles = {
    submitted: "bg-yellow-100 text-yellow-800",
    verified: "bg-blue-100 text-blue-800",
    funded: "bg-green-100 text-green-800",
    completed: "bg-purple-100 text-purple-800",
    pending: "bg-orange-100 text-orange-800",
    failed: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={cn(baseClasses, statusStyles[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
