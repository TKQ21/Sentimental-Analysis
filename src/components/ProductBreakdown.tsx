import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
  data: { product: string; positive: number; neutral: number; negative: number }[];
}

export function ProductBreakdown({ data }: Props) {
  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Product-wise Sentiment</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="product" type="category" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} width={140} />
            <Tooltip contentStyle={{ background: "hsl(222, 47%, 11%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="positive" stackId="a" fill="hsl(160, 84%, 39%)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="neutral" stackId="a" fill="hsl(38, 92%, 50%)" />
            <Bar dataKey="negative" stackId="a" fill="hsl(0, 84%, 60%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
