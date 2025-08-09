"use client";

import React, { useEffect, useMemo, useState } from "react";

type Comment = {
  id: string;
  name: string;
  rating: number; // 1..5
  text: string;
  createdAt: string;
};

export default function Comments({ campaignId }: { campaignId: string }) {
  const storageKey = `comments_${campaignId}`;
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setComments(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  const avg = useMemo(() => {
    if (comments.length === 0) return 0;
    return comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.length;
  }, [comments]);

  function save(next: Comment[]) {
    setComments(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim() || rating < 1 || rating > 5) return;
    const next: Comment = {
      id: `${Date.now()}`,
      name: name.trim(),
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [next, ...comments].slice(0, 200);
    save(updated);
    setName(""); setRating(5); setText("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">Average rating</div>
        <div className="flex items-center gap-2">
          <Stars value={avg} />
          <span className="text-app text-sm font-semibold">{avg.toFixed(1)}</span>
          <span className="text-muted text-xs">({comments.length})</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-5 gap-2">
        <input
          className="input md:col-span-2"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="dropdown"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} stars</option>)}
        </select>
        <input
          className="input md:col-span-2"
          placeholder="Write a review or comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">Post</button>
      </form>

      <div className="space-y-2">
        {comments.length === 0 ? (
          <div className="text-muted text-sm">No reviews yet. Be the first to share feedback.</div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-card border border-subtle rounded p-3">
              <div className="flex items-center justify-between">
                <div className="text-app text-sm font-semibold">{c.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Stars value={c.rating} />
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-sm text-app mt-1">{c.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const items = Array.from({ length: 5 }, (_, i) => i < full ? 'full' : i === full && half ? 'half' : 'empty');
  return (
    <div className="flex items-center">
      {items.map((t, i) => (
        <span key={i} className={t === 'empty' ? 'text-muted' : 'text-primary'}>★</span>
      ))}
    </div>
  );
}


