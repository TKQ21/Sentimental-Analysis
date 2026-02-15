import { useState } from "react";
import type { AnalyzedReview } from "@/lib/api";

interface Props {
  reviews: AnalyzedReview[];
}

const sentimentBadge = {
  Positive: "bg-sentiment-positive/15 text-sentiment-positive border-sentiment-positive/30",
  Neutral: "bg-sentiment-neutral/15 text-sentiment-neutral border-sentiment-neutral/30",
  Negative: "bg-sentiment-negative/15 text-sentiment-negative border-sentiment-negative/30",
};

export function ReviewsTable({ reviews }: Props) {
  const [filter, setFilter] = useState<"All" | "Positive" | "Neutral" | "Negative">("All");
  const [page, setPage] = useState(0);
  const perPage = 10;

  const filtered = filter === "All" ? reviews : reviews.filter(r => r.sentiment === filter);
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageReviews = filtered.slice(page * perPage, (page + 1) * perPage);

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-muted-foreground">Individual Review Analysis</h3>
        <div className="flex gap-1">
          {(["All", "Positive", "Neutral", "Negative"] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2 text-xs text-muted-foreground font-medium">Product</th>
              <th className="text-left p-2 text-xs text-muted-foreground font-medium">Review</th>
              <th className="text-center p-2 text-xs text-muted-foreground font-medium">Rating</th>
              <th className="text-center p-2 text-xs text-muted-foreground font-medium">Sentiment</th>
              <th className="text-center p-2 text-xs text-muted-foreground font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {pageReviews.map((r, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                <td className="p-2 text-xs max-w-[120px] truncate">{r.product}</td>
                <td className="p-2 text-xs max-w-[300px] truncate" title={r.reviewText}>{r.reviewText}</td>
                <td className="p-2 text-center">
                  <span className="text-xs">{"★".repeat(Math.round(r.rating))}{"☆".repeat(5 - Math.round(r.rating))}</span>
                </td>
                <td className="p-2 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sentimentBadge[r.sentiment]}`}>
                    {r.sentiment}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <div className="flex items-center gap-1.5 justify-center">
                    <div className="w-12 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${r.confidence * 100}%`,
                          background: r.sentiment === "Positive"
                            ? "hsl(var(--sentiment-positive))"
                            : r.sentiment === "Negative"
                              ? "hsl(var(--sentiment-negative))"
                              : "hsl(var(--sentiment-neutral))",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{(r.confidence * 100).toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">{filtered.length} reviews</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="text-xs px-2 py-1 bg-surface-2 rounded disabled:opacity-30">Prev</button>
            <span className="text-xs px-2 py-1 text-muted-foreground">{page + 1}/{totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="text-xs px-2 py-1 bg-surface-2 rounded disabled:opacity-30">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
