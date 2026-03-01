import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageSquare, X, Send } from "lucide-react";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistantWidget() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const ui = useMemo(() => {
    if (language === "ar") {
      return {
        title: "مساعد Meteory",
        placeholder: "اكتب سؤالك…",
        openLabel: "افتح المساعد",
        closeLabel: "إغلاق",
        sendLabel: "إرسال",
        hello:
          "مرحباً! أنا مساعد Meteory. اسألني عن المنتجات، الداتا شيت، الأنظمة، أو كيفية طلب عرض سعر.",
        error: "حدث خطأ. حاول مرة أخرى.",
      };
    }
    return {
      title: "Meteory Assistant",
      placeholder: "Type your question…",
      openLabel: "Open assistant",
      closeLabel: "Close",
      sendLabel: "Send",
      hello:
        "Hi! I’m the Meteory assistant. Ask me about products, datasheets, systems, or getting a quote.",
      error: "Something went wrong. Please try again.",
    };
  }, [language]);

  // Seed a greeting when first opened.
  useEffect(() => {
    if (!open) return;
    setMessages((prev) => (prev.length ? prev : [{ role: "assistant", content: ui.hello }]));
  }, [open, ui.hello]);

  // Auto-scroll on new messages.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);

    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);

    // Add a lightweight system instruction depending on site language.
    const system =
      language === "ar"
        ? "أنت مساعد موقع Meteory لحلول السلامة من الحرائق. أجب بإيجاز وبأسلوب مهني، وقدّم خطوات واضحة وروابط صفحات داخل الموقع إن أمكن."
        : "You are the Meteory fire-safety website assistant. Be concise, professional, and give clear next steps. When relevant, suggest pages on this site.";

    try {
      const resp = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0.4,
          messages: [
            { role: "system", content: system },
            // Keep the last ~10 turns to control token usage
            ...nextMessages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data?.success) {
        const msg = (data && (data.error || data.message)) || `HTTP ${resp.status}`;
        throw new Error(msg);
      }

      const assistantText = String(data?.content || "").trim();
      setMessages((prev) => [...prev, { role: "assistant", content: assistantText || ui.error }]);
    } catch (e: any) {
      console.error(e);
      const detail = e?.message ? ` (${e.message})` : "";
      setMessages((prev) => [...prev, { role: "assistant", content: ui.error + detail }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {open && (
        <div className="mb-3 w-[320px] max-w-[90vw] rounded-2xl border border-border bg-background shadow-xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/70">
            <div className="font-semibold text-sm">{ui.title}</div>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
              aria-label={ui.closeLabel}
              title={ui.closeLabel}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div ref={listRef} className="max-h-[40vh] overflow-y-auto px-4 py-3 space-y-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl bg-primary text-primary-foreground px-3 py-2 text-sm leading-relaxed"
                    : "mr-auto max-w-[85%] rounded-2xl bg-muted text-foreground px-3 py-2 text-sm leading-relaxed"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-muted text-foreground px-3 py-2 text-sm">
                {language === "ar" ? "جارٍ الكتابة…" : "Typing…"}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-3 border-t border-border/70">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder={ui.placeholder}
              className="flex-1 h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <button
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
              aria-label={ui.sendLabel}
              title={ui.sendLabel}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-background border border-border shadow-lg px-4 py-3 text-sm font-semibold hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={ui.openLabel}
        title={ui.openLabel}
      >
        <MessageSquare className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">{ui.title}</span>
      </button>
    </div>
  );
}
