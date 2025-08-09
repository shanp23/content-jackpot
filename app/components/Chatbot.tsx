"use client";

import React, { useEffect, useRef, useState } from "react";

type Message = { id: string; role: 'user' | 'assistant'; text: string; at: string };

export default function Chatbot({ threadKey }: { threadKey: string }) {
  const storageKey = `chat_${threadKey}`;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);

  function save(next: Message[]) {
    setMessages(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  function onSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: `${Date.now()}u`, role: 'user', text, at: new Date().toISOString() };
    const updated = [...messages, userMsg];
    save(updated);
    setInput("");
    // Simple rule-based assistant for creators
    const replyText = getAssistantReply(text);
    const assistant: Message = { id: `${Date.now()}a`, role: 'assistant', text: replyText, at: new Date().toISOString() };
    save([...updated, assistant]);
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="bg-card border border-subtle rounded-lg shadow-xl w-[320px] h-[420px] flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-subtle flex items-center justify-between">
            <div className="text-app font-semibold text-sm">Creator Assistant</div>
            <button className="text-muted" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.length === 0 && (
              <div className="text-muted text-sm">Ask about setting up phases, budgets, or submission rules.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`text-sm ${m.role === 'user' ? 'text-app' : 'text-muted'}`}>
                <div className={`inline-block rounded px-2 py-1 border ${m.role === 'user' ? 'border-subtle bg-card' : 'border-subtle bg-app/50'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={onSend} className="p-3 border-t border-subtle flex gap-2">
            <input className="input flex-1" placeholder="Type a question..." value={input} onChange={(e) => setInput(e.target.value)} />
            <button className="btn btn-primary" type="submit">Send</button>
          </form>
        </div>
      )}
      {!open && (
        <button className="bg-primary text-white rounded-full h-12 w-12 shadow-lg" onClick={() => setOpen(true)}>💬</button>
      )}
    </div>
  );
}

function getAssistantReply(q: string): string {
  const s = q.toLowerCase();
  if (s.includes('danger') || s.includes('strip')) {
    return 'Try Standard preset for balanced stripping, or Custom if you need precise phase timings. You can use 0-120 min at 25%/40%, then 120-240 at 30%/50%.';
  }
  if (s.includes('budget') || s.includes('pool')) {
    return 'Your jackpot pool is funded by strip from the bottom percentile. Keep base reward low to ensure headroom for the jackpot.';
  }
  if (s.includes('submit') || s.includes('verification') || s.includes('handle')) {
    return 'Creators must link a social profile and place their 7-letter code in bio. Submissions must use a verified handle.';
  }
  if (s.includes('payout') || s.includes('winner')) {
    return 'When the campaign completes, we freeze winners and split the pool among top 3. The split is randomized once and does not change after completion.';
  }
  return 'I can help with phases, budgets, verification, and payouts. Ask me about presets or Custom configuration.';
}


