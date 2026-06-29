import { NextResponse } from "next/server";
import type { AnalyzeAction, AnalyzeRequest } from "@/lib/types";
import { ACTION_LABELS } from "@/lib/types";

const ACTION_HINTS: Record<AnalyzeAction, string> = {
  summary:
    "Здесь появится краткое описание статьи: основная тема, контекст и выводы.",
  theses:
    "Здесь появятся ключевые тезисы статьи в виде структурированного списка.",
  telegram:
    "Здесь появится готовый пост для Telegram: заголовок, суть и призыв к действию.",
};

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: AnalyzeRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON в запросе." }, { status: 400 });
  }

  const url = body.url?.trim();
  const action = body.action;

  if (!url) {
    return NextResponse.json({ error: "Укажите URL статьи." }, { status: 400 });
  }

  if (!isValidUrl(url)) {
    return NextResponse.json({ error: "Введите корректный URL (http или https)." }, { status: 400 });
  }

  if (!action || !(action in ACTION_LABELS)) {
    return NextResponse.json({ error: "Неизвестный тип действия." }, { status: 400 });
  }

  // Заглушка: парсинг статьи и вызов AI будут добавлены позже.
  const result = [
    `Режим: «${ACTION_LABELS[action]}»`,
    `Источник: ${url}`,
    "",
    ACTION_HINTS[action],
    "",
    "⚠️ Сейчас это демонстрационный ответ. После подключения парсера и AI здесь будет сгенерированный текст.",
  ].join("\n");

  return NextResponse.json({ action, result });
}
