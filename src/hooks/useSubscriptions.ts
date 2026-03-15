"use client";
import { STORAGE_KEY } from "@/lib/constants";
import { ICON_META, IconKey, Subscription } from "@/types/subscription";
import { useEffect, useState } from "react";

// Eski localStorage formatı renk kullanıyordu — ikona migrate et
const COLOR_TO_ICON: Record<string, IconKey> = {
  violet: "ai",
  blue: "productivity",
  teal: "music",
  orange: "streaming",
  pink: "shopping",
  amber: "education",
};

const VALID_CYCLES = new Set(["monthly", "yearly", "weekly"]);
const VALID_ICONS = new Set(Object.keys(ICON_META));

function isValidSub(s: unknown): s is Subscription {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.name === "string" &&
    o.name.trim().length > 0 &&
    typeof o.price === "number" &&
    o.price >= 0 &&
    typeof o.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(o.date) &&
    VALID_CYCLES.has(o.cycle as string) &&
    VALID_ICONS.has(o.icon as string)
  );
}

function migrate(raw: unknown): Subscription[] {
  if (!Array.isArray(raw)) {
    console.warn("[subtrack] localStorage verisi array değil, sıfırlanıyor");
    return [];
  }
  return raw.reduce<Subscription[]>((acc, s: unknown) => {
    if (!s || typeof s !== "object") return acc;
    const o = { ...(s as Record<string, unknown>) };
    // icon yoksa color'dan migrate et
    if (!o.icon && o.color) {
      o.icon = COLOR_TO_ICON[o.color as string] ?? "other";
    }
    if (isValidSub(o)) acc.push(o);
    return acc;
  }, []);
}

export function useSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      setSubs(parsed ? migrate(parsed) : []);
    } catch (err) {
      console.error("[subtrack] localStorage okunamadı:", err);
      setSubs([]);
    }
    setLoaded(true);
  }, []);

  const save = (next: Subscription[]) => {
    setSubs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("[subtrack] localStorage yazılamadı:", err);
    }
  };

  const add = (s: Omit<Subscription, "id">) =>
    save([...subs, { ...s, id: Date.now() }]);
  const update = (s: Subscription) =>
    save(subs.map((x) => (x.id === s.id ? s : x)));
  const remove = (id: number) => save(subs.filter((x) => x.id !== id));

  return { subs, loaded, add, update, remove };
}
