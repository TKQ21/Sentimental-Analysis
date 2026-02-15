// API Service Layer — connect to your FastAPI backend
// Change this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface ReviewInput {
  review_id: string;
  product_name: string;
  review_text: string;
  rating: number;
  review_date: string;
}

export interface SentimentResult {
  review_id: string;
  product_name: string;
  review_text: string;
  rating: number;
  review_date: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  confidence: number;
  vader_score: number;
  model_used: string;
}

export interface DashboardData {
  total_reviews: number;
  sentiment_distribution: { label: string; count: number; percentage: number }[];
  product_breakdown: { product: string; positive: number; neutral: number; negative: number }[];
  trend_data: { date: string; positive: number; neutral: number; negative: number }[];
  top_negative_keywords: { word: string; count: number }[];
  top_positive_keywords: { word: string; count: number }[];
  model_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confusion_matrix: number[][];
  };
}

export async function predictSingle(reviewText: string): Promise<SentimentResult> {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review_text: reviewText }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function bulkPredict(file: File): Promise<SentimentResult[]> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/bulk_predict`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getDashboardData(): Promise<DashboardData> {
  const res = await fetch(`${API_BASE_URL}/dashboard_data`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Demo data for when backend is not connected
export function getDemoData(): DashboardData {
  return {
    total_reviews: 2847,
    sentiment_distribution: [
      { label: "Positive", count: 1652, percentage: 58 },
      { label: "Neutral", count: 598, percentage: 21 },
      { label: "Negative", count: 597, percentage: 21 },
    ],
    product_breakdown: [
      { product: "Wireless Earbuds Pro", positive: 312, neutral: 89, negative: 45 },
      { product: "Smart Watch X3", positive: 278, neutral: 102, negative: 67 },
      { product: "Laptop Stand Deluxe", positive: 245, neutral: 56, negative: 34 },
      { product: "USB-C Hub Ultra", positive: 198, neutral: 78, negative: 112 },
      { product: "Noise Cancelling Headset", positive: 342, neutral: 67, negative: 41 },
      { product: "Portable Charger 20K", positive: 277, neutral: 206, negative: 298 },
    ],
    trend_data: [
      { date: "Jan", positive: 120, neutral: 45, negative: 35 },
      { date: "Feb", positive: 145, neutral: 52, negative: 42 },
      { date: "Mar", positive: 132, neutral: 48, negative: 55 },
      { date: "Apr", positive: 168, neutral: 61, negative: 38 },
      { date: "May", positive: 178, neutral: 55, negative: 44 },
      { date: "Jun", positive: 195, neutral: 63, negative: 51 },
      { date: "Jul", positive: 210, neutral: 58, negative: 47 },
      { date: "Aug", positive: 188, neutral: 72, negative: 62 },
      { date: "Sep", positive: 225, neutral: 49, negative: 39 },
      { date: "Oct", positive: 240, neutral: 55, negative: 48 },
      { date: "Nov", positive: 262, neutral: 68, negative: 52 },
      { date: "Dec", positive: 289, neutral: 72, negative: 84 },
    ],
    top_negative_keywords: [
      { word: "broken", count: 87 },
      { word: "defective", count: 72 },
      { word: "slow", count: 65 },
      { word: "overpriced", count: 58 },
      { word: "disappointing", count: 52 },
      { word: "poor quality", count: 48 },
      { word: "malfunction", count: 41 },
      { word: "uncomfortable", count: 38 },
    ],
    top_positive_keywords: [
      { word: "excellent", count: 234 },
      { word: "amazing", count: 198 },
      { word: "perfect", count: 176 },
      { word: "love it", count: 165 },
      { word: "great value", count: 142 },
      { word: "comfortable", count: 128 },
      { word: "fast shipping", count: 112 },
      { word: "recommend", count: 98 },
    ],
    model_metrics: {
      accuracy: 0.874,
      precision: 0.861,
      recall: 0.882,
      f1_score: 0.871,
      confusion_matrix: [
        [482, 28, 12],
        [35, 178, 19],
        [18, 22, 206],
      ],
    },
  };
}

export function analyzeSentimentLocally(text: string): { sentiment: "Positive" | "Neutral" | "Negative"; confidence: number } {
  const positiveWords = ["great", "excellent", "amazing", "love", "perfect", "wonderful", "fantastic", "best", "awesome", "good", "happy", "recommend", "quality", "comfortable", "fast", "beautiful", "impressive", "reliable", "solid", "worth"];
  const negativeWords = ["bad", "terrible", "awful", "hate", "worst", "broken", "defective", "poor", "disappointing", "slow", "waste", "horrible", "cheap", "uncomfortable", "useless", "overpriced", "malfunction", "damaged", "refund", "never"];

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  let posCount = 0;
  let negCount = 0;

  words.forEach(w => {
    if (positiveWords.some(pw => w.includes(pw))) posCount++;
    if (negativeWords.some(nw => w.includes(nw))) negCount++;
  });

  const total = Math.max(posCount + negCount, 1);
  if (posCount > negCount) return { sentiment: "Positive", confidence: 0.5 + (posCount / total) * 0.4 };
  if (negCount > posCount) return { sentiment: "Negative", confidence: 0.5 + (negCount / total) * 0.4 };
  return { sentiment: "Neutral", confidence: 0.55 };
}
