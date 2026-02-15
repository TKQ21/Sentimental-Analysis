import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: { label: string; count: number; percentage: number }[];
}

const COLORS = {
  Positive: "hsl(160, 84%, 39%)",
  Neutral: "hsl(38, 92%, 50%)",
  Negative: "hsl(0, 84%, 60%)",
};

export function SentimentDistribution({ data }: Props) {
  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Sentiment Distribution</h3>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="count"
                nameKey="label"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.label} fill={COLORS[entry.label as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(222, 47%, 11%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }}
                itemStyle={{ color: "hsl(210, 40%, 96%)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[item.label as keyof typeof COLORS] }} />
                <span className="text-sm">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">{item.percentage}%</span>
                <span className="text-xs text-muted-foreground ml-2">({item.count.toLocaleString()})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
