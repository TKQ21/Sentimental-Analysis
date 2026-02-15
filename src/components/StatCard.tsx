import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "positive" | "neutral" | "negative";
}

const variantStyles = {
  default: "glass-card",
  positive: "glass-card border-sentiment-positive/30",
  neutral: "glass-card border-sentiment-neutral/30",
  negative: "glass-card border-sentiment-negative/30",
};

const iconVariantStyles = {
  default: "bg-primary/10 text-primary",
  positive: "bg-sentiment-positive/10 text-sentiment-positive",
  neutral: "bg-sentiment-neutral/10 text-sentiment-neutral",
  negative: "bg-sentiment-negative/10 text-sentiment-negative",
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, variant = "default" }: StatCardProps) {
  return (
    <div className={`${variantStyles[variant]} rounded-lg p-5 animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-display font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${iconVariantStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className={trend === "up" ? "sentiment-positive" : trend === "down" ? "sentiment-negative" : "text-muted-foreground"}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
