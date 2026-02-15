import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { analyzeSentimentLocally, predictSingle } from "@/lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function LivePredictor() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ sentiment: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      if (API_BASE_URL) {
        const res = await predictSingle(text);
        setResult({ sentiment: res.sentiment, confidence: res.confidence });
      } else {
        // Local fallback
        await new Promise((r) => setTimeout(r, 600));
        setResult(analyzeSentimentLocally(text));
      }
    } catch {
      setResult(analyzeSentimentLocally(text));
    } finally {
      setLoading(false);
    }
  };

  const sentimentColor = result
    ? result.sentiment === "Positive"
      ? "text-sentiment-positive"
      : result.sentiment === "Negative"
        ? "text-sentiment-negative"
        : "text-sentiment-neutral"
    : "";

  const sentimentBg = result
    ? result.sentiment === "Positive"
      ? "bg-sentiment-positive/10 border-sentiment-positive/30"
      : result.sentiment === "Negative"
        ? "bg-sentiment-negative/10 border-sentiment-negative/30"
        : "bg-sentiment-neutral/10 border-sentiment-neutral/30"
    : "";

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Real-time Sentiment Prediction</h3>
      <div className="flex gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste a product review to analyze..."
          className="flex-1 bg-surface-2 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePredict(); } }}
        />
        <button
          onClick={handlePredict}
          disabled={loading || !text.trim()}
          className="self-end px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Analyze
        </button>
      </div>
      {result && (
        <div className={`mt-4 p-4 rounded-lg border ${sentimentBg} transition-all`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Predicted Sentiment</span>
              <p className={`text-lg font-display font-bold ${sentimentColor}`}>{result.sentiment}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Confidence</span>
              <p className="text-lg font-display font-bold text-foreground">{(result.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-2 w-full bg-surface-2 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${result.confidence * 100}%`,
                background: result.sentiment === "Positive"
                  ? "hsl(160, 84%, 39%)"
                  : result.sentiment === "Negative"
                    ? "hsl(0, 84%, 60%)"
                    : "hsl(38, 92%, 50%)",
              }}
            />
          </div>
        </div>
      )}
      {!API_BASE_URL && (
        <p className="mt-3 text-xs text-muted-foreground">
          ⚡ Using local keyword analysis. Set <code className="text-primary">VITE_API_BASE_URL</code> to connect to your FastAPI backend.
        </p>
      )}
    </div>
  );
}
