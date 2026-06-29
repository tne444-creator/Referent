export type AnalyzeAction = "summary" | "theses" | "telegram";

export type AnalyzeRequest = {
  url: string;
  action: AnalyzeAction;
};

export type AnalyzeResponse = {
  action: AnalyzeAction;
  result: string;
};

export const ACTION_LABELS: Record<AnalyzeAction, string> = {
  summary: "О чем статья?",
  theses: "Тезисы",
  telegram: "Пост для Telegram",
};
