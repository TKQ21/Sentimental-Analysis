interface Props {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confusion_matrix: number[][];
  };
}

export function ModelMetrics({ metrics }: Props) {
  const labels = ["Positive", "Neutral", "Negative"];
  const maxVal = Math.max(...metrics.confusion_matrix.flat());

  const metricItems = [
    { label: "Accuracy", value: metrics.accuracy },
    { label: "Precision", value: metrics.precision },
    { label: "Recall", value: metrics.recall },
    { label: "F1 Score", value: metrics.f1_score },
  ];

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">Model Evaluation</h3>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {metricItems.map((m) => (
          <div key={m.label} className="bg-surface-2 rounded-lg p-3 text-center">
            <p className="text-2xl font-display font-bold text-primary">{(m.value * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>
      <h4 className="text-xs text-muted-foreground mb-3 font-medium">Confusion Matrix</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-muted-foreground">Predicted →</th>
              {labels.map((l) => (
                <th key={l} className="p-2 text-center text-muted-foreground">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.confusion_matrix.map((row, i) => (
              <tr key={i}>
                <td className="p-2 text-muted-foreground font-medium">{labels[i]}</td>
                {row.map((val, j) => {
                  const intensity = val / maxVal;
                  const isDiag = i === j;
                  return (
                    <td
                      key={j}
                      className="p-2 text-center font-semibold rounded"
                      style={{
                        background: isDiag
                          ? `hsla(160, 84%, 39%, ${intensity * 0.4})`
                          : `hsla(0, 84%, 60%, ${intensity * 0.3})`,
                      }}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
