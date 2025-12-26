type StatusBadgeProps = {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const statusVariants = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const sizeVariants = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

const StatusBadge = ({
  status,
  variant = "default",
  size = "md",
  className = "",
}: StatusBadgeProps) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  const variantClasses = statusVariants[variant];
  const sizeClasses = sizeVariants[size];

  return (
    <span className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      {status}
    </span>
  );
};

// Helper function to determine variant from status value
export const getStatusVariant = (status: string): StatusBadgeProps["variant"] => {
  const statusLower = status.toLowerCase();
  
  if (statusLower === "active" || statusLower === "present" || statusLower === "completed" || statusLower === "success") {
    return "success";
  }
  if (statusLower === "inactive" || statusLower === "absent" || statusLower === "pending" || statusLower === "warning") {
    return "warning";
  }
  if (statusLower === "error" || statusLower === "failed" || statusLower === "cancelled") {
    return "error";
  }
  if (statusLower === "info" || statusLower === "draft") {
    return "info";
  }
  
  return "default";
};

export default StatusBadge;

