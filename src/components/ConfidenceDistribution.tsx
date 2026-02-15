import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import type { AnalyzedReview } from "@/lib/api";

interface Props {
  reviews: AnalyzedReview[];
}

export function ConfidenceDistribution({ reviews }: Props) {
  // Create histogram buckets
  const buckets = [
    { range: "50-60%", min: 0.5, max: 0.6, count: 0 },
    { range: "60-70%", min: 0.6, max: 0.7, count: 0 },
    { range: "70-80%", min: 0.7, max: 0.8, count: 0 },
    { range: "80-90%", min: 0.8, max: 0.9, count: 0 },
    { range: "90-100%", min: 0.9, max: 1.01, count: 0 },
  ];

  reviews.forEach(r => {
    const bucket = buckets.find(b => r.confidence >= b.min && r.confidence < b.max);
    if (bucket) bucket.count++;
  });

  const colors = ["hsl(0, 84%, 60%)", "hsl(38, 92%, 50%)", "hsl(38, 92%, 50%)", "hsl(160, 84%, 39%)", "hsl(160, 84%, 39%)"];

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Confidence Distribution</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(222, 47%, 11%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {buckets.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
