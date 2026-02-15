import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  onUpload: (file: File) => Promise<void>;
}

export function FileUpload({ onUpload }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState("");

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setStatus("error");
      setFileName("Please upload a CSV file");
      return;
    }
    setFileName(file.name);
    setStatus("uploading");
    try {
      await onUpload(file);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`glass-card rounded-lg p-8 text-center transition-all cursor-pointer border-2 border-dashed animate-fade-in ${
        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
      }`}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        };
        input.click();
      }}
    >
      {status === "idle" && (
        <>
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium">Drop your CSV file here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">Columns: review_id, product_name, review_text, rating, review_date</p>
        </>
      )}
      {status === "uploading" && (
        <>
          <Loader2 className="h-10 w-10 text-primary mx-auto mb-3 animate-spin" />
          <p className="text-sm font-medium">Analyzing {fileName}...</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="h-10 w-10 text-sentiment-positive mx-auto mb-3" />
          <p className="text-sm font-medium sentiment-positive">Analysis complete!</p>
          <p className="text-xs text-muted-foreground mt-1">{fileName}</p>
          <button onClick={(e) => { e.stopPropagation(); setStatus("idle"); setFileName(""); }} className="mt-3 text-xs text-primary hover:underline">Upload another file</button>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="h-10 w-10 text-sentiment-negative mx-auto mb-3" />
          <p className="text-sm font-medium sentiment-negative">{fileName || "Upload failed"}</p>
          <button onClick={(e) => { e.stopPropagation(); setStatus("idle"); setFileName(""); }} className="mt-3 text-xs text-primary hover:underline">Try again</button>
        </>
      )}
    </div>
  );
}
