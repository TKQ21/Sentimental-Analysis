import { useState } from "react";
import { BarChart3, MessageSquareText, TrendingUp, AlertTriangle, Activity, Download, Database } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SentimentDistribution } from "@/components/SentimentDistribution";
import { SentimentTrend } from "@/components/SentimentTrend";
import { ProductBreakdown } from "@/components/ProductBreakdown";
import { KeywordCloud } from "@/components/KeywordCloud";
import { ModelMetrics } from "@/components/ModelMetrics";
import { LivePredictor } from "@/components/LivePredictor";
import { FileUpload } from "@/components/FileUpload";
import { getDemoData, bulkPredict, type DashboardData } from "@/lib/api";

const Index = () => {
  const [data, setData] = useState<DashboardData>(getDemoData());
  const [activeTab, setActiveTab] = useState<"overview" | "predict" | "model">("overview");

  const handleUpload = async (file: File) => {
    try {
      await bulkPredict(file);
      // In production, re-fetch dashboard data here
    } catch {
      // Using demo data as fallback
    }
    // Simulate refresh with demo data
    setData(getDemoData());
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
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-2 px-3 py-1.5 rounded-full">
              <Database className="h-3 w-3" />
              {data.total_reviews.toLocaleString()} reviews
            </span>
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
        {activeTab === "overview" && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Reviews"
                value={data.total_reviews.toLocaleString()}
                icon={BarChart3}
                trend="up"
                trendValue="12%"
              />
              <StatCard
                title="Positive Sentiment"
                value={`${data.sentiment_distribution[0]?.percentage ?? 0}%`}
                subtitle={`${data.sentiment_distribution[0]?.count.toLocaleString()} reviews`}
                icon={TrendingUp}
                variant="positive"
                trend="up"
                trendValue="3.2%"
              />
              <StatCard
                title="Negative Sentiment"
                value={`${data.sentiment_distribution[2]?.percentage ?? 0}%`}
                subtitle={`${data.sentiment_distribution[2]?.count.toLocaleString()} reviews`}
                icon={AlertTriangle}
                variant="negative"
                trend="down"
                trendValue="1.5%"
              />
              <StatCard
                title="Model Accuracy"
                value={`${(data.model_metrics.accuracy * 100).toFixed(1)}%`}
                subtitle="BERT + Logistic Regression"
                icon={Activity}
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <SentimentDistribution data={data.sentiment_distribution} />
              </div>
              <div className="lg:col-span-3">
                <SentimentTrend data={data.trend_data} />
              </div>
            </div>

            {/* Product Breakdown */}
            <ProductBreakdown data={data.product_breakdown} />

            {/* Keywords */}
            <KeywordCloud positive={data.top_positive_keywords} negative={data.top_negative_keywords} />
          </>
        )}

        {activeTab === "predict" && (
          <div className="space-y-6 max-w-3xl">
            <LivePredictor />
            <FileUpload onUpload={handleUpload} />
          </div>
        )}

        {activeTab === "model" && (
          <div className="max-w-3xl">
            <ModelMetrics metrics={data.model_metrics} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <p className="text-center text-xs text-muted-foreground">
          SentimentIQ — Connect your FastAPI backend via <code className="text-primary">VITE_API_BASE_URL</code> for live ML inference
        </p>
      </footer>
    </div>
  );
};

export default Index;
