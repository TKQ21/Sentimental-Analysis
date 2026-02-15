import { ThumbsUp, Minus, ThumbsDown } from "lucide-react";
import type { AnalyzedReview } from "@/lib/api";

interface Props {
  reviews: AnalyzedReview[];
}

export function SentimentSummaryCards({ reviews }: Props) {
  const groups = {
    Positive: reviews.filter(r => r.sentiment === "Positive"),
    Neutral: reviews.filter(r => r.sentiment === "Neutral"),
    Negative: reviews.filter(r => r.sentiment === "Negative"),
  };

  const avgRating = (arr: AnalyzedReview[]) =>
    arr.length > 0 ? (arr.reduce((s, r) => s + r.rating, 0) / arr.length).toFixed(1) : "—";

  const avgConf = (arr: AnalyzedReview[]) =>
    arr.length > 0 ? (arr.reduce((s, r) => s + r.confidence, 0) / arr.length * 100).toFixed(0) + "%" : "—";

  const cards = [
    {
      label: "Positive",
      icon: ThumbsUp,
      count: groups.Positive.length,
      avgRating: avgRating(groups.Positive),
      avgConf: avgConf(groups.Positive),
      color: "sentiment-positive",
      bgClass: "bg-sentiment-positive/10 border-sentiment-positive/30",
    },
    {
      label: "Neutral",
      icon: Minus,
      count: groups.Neutral.length,
      avgRating: avgRating(groups.Neutral),
      avgConf: avgConf(groups.Neutral),
      color: "sentiment-neutral",
      bgClass: "bg-sentiment-neutral/10 border-sentiment-neutral/30",
    },
    {
      label: "Negative",
      icon: ThumbsDown,
      count: groups.Negative.length,
      avgRating: avgRating(groups.Negative),
      avgConf: avgConf(groups.Negative),
      color: "sentiment-negative",
      bgClass: "bg-sentiment-negative/10 border-sentiment-negative/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      {cards.map(c => (
        <div key={c.label} className={`rounded-lg p-5 border ${c.bgClass}`}>
          <div className="flex items-center gap-2 mb-3">
            <c.icon className={`h-5 w-5 text-${c.color}`} />
            <h4 className={`font-display font-bold text-${c.color}`}>{c.label}</h4>
          </div>
          <p className="text-3xl font-display font-bold">{c.count}</p>
          <p className="text-xs text-muted-foreground mt-1">reviews</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-surface-2/50 rounded p-2">
              <p className="text-xs text-muted-foreground">Avg Rating</p>
              <p className="text-sm font-semibold">{c.avgRating} ★</p>
            </div>
            <div className="bg-surface-2/50 rounded p-2">
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
              <p className="text-sm font-semibold">{c.avgConf}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
