interface Keyword {
  word: string;
  count: number;
}

interface Props {
  positive: Keyword[];
  negative: Keyword[];
}

export function KeywordCloud({ positive, negative }: Props) {
  const maxCount = Math.max(...positive.map(k => k.count), ...negative.map(k => k.count));

  const getSize = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.75) return "text-xl font-bold";
    if (ratio > 0.5) return "text-lg font-semibold";
    if (ratio > 0.25) return "text-base font-medium";
    return "text-sm";
  };

  return (
    <div className="grid grid-cols-2 gap-4 animate-fade-in">
      <div className="glass-card rounded-lg p-5">
        <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">
          <span className="inline-block w-2 h-2 rounded-full bg-sentiment-positive mr-2" />
          Top Positive Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {positive.map((kw) => (
            <span
              key={kw.word}
              className={`${getSize(kw.count)} text-sentiment-positive/80 hover:text-sentiment-positive transition-colors cursor-default`}
              title={`${kw.count} mentions`}
            >
              {kw.word}
            </span>
          ))}
        </div>
      </div>
      <div className="glass-card rounded-lg p-5">
        <h3 className="font-display font-semibold text-sm text-muted-foreground mb-4">
          <span className="inline-block w-2 h-2 rounded-full bg-sentiment-negative mr-2" />
          Top Negative Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {negative.map((kw) => (
            <span
              key={kw.word}
              className={`${getSize(kw.count)} text-sentiment-negative/80 hover:text-sentiment-negative transition-colors cursor-default`}
              title={`${kw.count} mentions`}
            >
              {kw.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
