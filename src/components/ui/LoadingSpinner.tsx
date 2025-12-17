interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  text = "加载中...",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="page h-screen flex-center flex-row gap-4">
      <div
        className={`${sizeClasses[size]} border-b-2 border-primary rounded-full animate-spin inline-block`}
      />
      {text && <p className="text-foreground/50 animate-pulse">{text}</p>}
    </div>
  );
}
