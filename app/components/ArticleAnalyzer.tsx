"use client";

import { useState } from "react";
import type { AnalyzeAction } from "@/lib/types";
import { ACTION_LABELS } from "@/lib/types";

const ACTIONS: AnalyzeAction[] = ["summary", "theses", "telegram"];

export default function ArticleAnalyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [activeAction, setActiveAction] = useState<AnalyzeAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(action: AnalyzeAction) {
    setError("");
    setLoading(true);
    setActiveAction(action);
    setResult("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Не удалось выполнить запрос.");
      }

      setResult(data.result);
    } catch (err) {
      setResult("");
      setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          Referent
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Анализ англоязычных статей
        </h1>
        <p className="text-slate-600">
          Вставьте ссылку на статью и выберите, какой результат нужно получить.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label htmlFor="article-url" className="mb-2 block text-sm font-medium text-slate-700">
          URL англоязычной статьи
        </label>
        <input
          id="article-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/article"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />

        <div className="mt-5 flex flex-wrap gap-3">
          {ACTIONS.map((action) => {
            const isActive = loading && activeAction === action;

            return (
              <button
                key={action}
                type="button"
                disabled={loading || !url.trim()}
                onClick={() => handleAnalyze(action)}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isActive ? "Генерация..." : ACTION_LABELS[action]}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Результат</h2>
          {activeAction && (
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              {ACTION_LABELS[activeAction]}
            </span>
          )}
        </div>

        <div className="min-h-48 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
          {loading ? (
            <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 text-slate-500">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
              <p className="text-sm">Генерация ответа...</p>
            </div>
          ) : result ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-800">
              {result}
            </pre>
          ) : (
            <p className="text-sm text-slate-500">
              Результат появится здесь после нажатия одной из кнопок.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
