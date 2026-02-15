import { useState } from "react";
import { BarChart3, MessageSquareText, TrendingUp, AlertTriangle, Activity, Download, Database, Upload, Percent } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SentimentDistribution } from "@/components/SentimentDistribution";
import { SentimentTrend } from "@/components/SentimentTrend";
import { ProductBreakdown } from "@/components/ProductBreakdown";
import { KeywordCloud } from "@/components/KeywordCloud";
import { ModelMetrics } from "@/components/ModelMetrics";
import { LivePredictor } from "@/components/LivePredictor";
import { FileUpload } from "@/components/FileUpload";
import { SentimentGauge } from "@/components/SentimentGauge";
import { ReviewsTable } from "@/components/ReviewsTable";
import { RatingVsSentiment } from "@/components/RatingVsSentiment";
import { ConfidenceDistribution } from "@/components/ConfidenceDistribution";
import { SentimentSummaryCards } from "@/components/SentimentSummaryCards";
import { getDemoData, analyzeCSVLocally, type DashboardData } from "@/lib/api";

const Index = () => {
  const [data, setData] = useState<DashboardData>(getDemoData());
  const [activeTab, setActiveTab] = useState<"overview" | "predict" | "model">("overview");
  const [hasData, setHasData] = useState(false);

  const handleUpload = async (file: File) => {
    const result = await analyzeCSVLocally(file);
    setData(result);
    setHasData(true);
    setActiveTab("overview");
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "predict" as const, label: "Live Analysis", icon: MessageSquareText },
    { id: "model" as const, label: "Model Metrics", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <header className="border-b border-border bg-surface-1/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquareText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight">SentimentIQ</h1>
              <p className="text-xs text-muted-foreground">E-Commerce Review Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasData && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-2 px-3 py-1.5 rounded-full">
                <Database className="h-3 w-3" />
                {data.total_reviews.toLocaleString()} reviews analyzed
              </span>
            )}
            <button className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
              <Download className="h-3 w-3" />
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <div className="flex gap-1 bg-surface-1 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* File Upload — always visible at top */}
        <FileUpload onUpload={handleUpload} />

        {activeTab === "overview" && hasData && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Reviews"
                value={data.total_reviews.toLocaleString()}
                icon={BarChart3}
              />
              <StatCard
                title="Positive Sentiment"
                value={`${data.sentiment_distribution[0]?.percentage ?? 0}%`}
                subtitle={`${data.sentiment_distribution[0]?.count.toLocaleString()} reviews`}
                icon={TrendingUp}
                variant="positive"
              />
              <StatCard
                title="Negative Sentiment"
                value={`${data.sentiment_distribution[2]?.percentage ?? 0}%`}
                subtitle={`${data.sentiment_distribution[2]?.count.toLocaleString()} reviews`}
                icon={AlertTriangle}
                variant="negative"
              />
              <StatCard
                title="Avg Confidence"
                value={`${(data.avg_confidence * 100).toFixed(1)}%`}
                subtitle="Keyword-based analysis"
                icon={Percent}
              />
            </div>

            {/* Sentiment Summary Cards — Positive / Neutral / Negative deep dive */}
            <SentimentSummaryCards reviews={data.reviews} />

            {/* Charts Row 1: Gauge + Distribution + Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              <div className="lg:col-span-2">
                <SentimentGauge
                  positive={data.sentiment_distribution[0]?.count ?? 0}
                  neutral={data.sentiment_distribution[1]?.count ?? 0}
                  negative={data.sentiment_distribution[2]?.count ?? 0}
                  total={data.total_reviews}
                />
              </div>
              <div className="lg:col-span-2">
                <SentimentDistribution data={data.sentiment_distribution} />
              </div>
              <div className="lg:col-span-3">
                <SentimentTrend data={data.trend_data} />
              </div>
            </div>

            {/* Charts Row 2: Rating vs Sentiment + Confidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.rating_sentiment_correlation.length > 0 && (
                <RatingVsSentiment data={data.rating_sentiment_correlation} />
              )}
              {data.reviews.length > 0 && (
                <ConfidenceDistribution reviews={data.reviews} />
              )}
            </div>

            {/* Product Breakdown */}
            {data.product_breakdown.length > 0 && (
              <ProductBreakdown data={data.product_breakdown} />
            )}

            {/* Keywords */}
            {(data.top_positive_keywords.length > 0 || data.top_negative_keywords.length > 0) && (
              <KeywordCloud positive={data.top_positive_keywords} negative={data.top_negative_keywords} />
            )}

            {/* Individual Reviews Table */}
            {data.reviews.length > 0 && (
              <ReviewsTable reviews={data.reviews} />
            )}
          </>
        )}

        {activeTab === "overview" && !hasData && (
          <div className="text-center py-20 animate-fade-in">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="font-display text-xl font-semibold text-muted-foreground">Upload a CSV to get started</h2>
            <p className="text-sm text-muted-foreground/70 mt-2">Your reviews will be analyzed and displayed here</p>
          </div>
        )}

        {activeTab === "predict" && (
          <div className="max-w-3xl">
            <LivePredictor />
          </div>
        )}

        {activeTab === "model" && hasData && (
          <div className="max-w-3xl">
            <ModelMetrics metrics={data.model_metrics} />
          </div>
        )}

        {activeTab === "model" && !hasData && (
          <div className="text-center py-20 animate-fade-in">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="font-display text-xl font-semibold text-muted-foreground">No data yet</h2>
            <p className="text-sm text-muted-foreground/70 mt-2">Upload a CSV file first to see evaluation metrics</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <p className="text-center text-xs text-muted-foreground">
          SentimentIQ — Upload a CSV or set <code className="text-primary">VITE_API_BASE_URL</code> for backend ML inference
        </p>
      </footer>
    </div>
  );
};

export default Index;
