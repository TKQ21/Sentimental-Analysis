import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; positive: number; neutral: number; negative: number }[];
}

export function SentimentTrend({ data }: Props) {
  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Sentiment Trend Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="neuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(222, 47%, 11%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="positive" stroke="hsl(160, 84%, 39%)" fill="url(#posGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="neutral" stroke="hsl(38, 92%, 50%)" fill="url(#neuGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="negative" stroke="hsl(0, 84%, 60%)" fill="url(#negGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-5 mt-3 justify-center">
        {[
          { label: "Positive", color: "hsl(160, 84%, 39%)" },
          { label: "Neutral", color: "hsl(38, 92%, 50%)" },
          { label: "Negative", color: "hsl(0, 84%, 60%)" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
