// src/hooks/useCart.js
import { useState, useEffect } from "react";

const KEY = "myitems:cart";

export function useCart() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(entries));
  }, [entries]);

  // 追加：指定された数量をカートへ加算
  const add = (id, quantity = 1) => {
    const amount = Math.max(1, Math.floor(Number(quantity) || 1));

    setEntries((currentEntries) => {
      const found = currentEntries.find((entry) => entry.id === id);

      if (found) {
        return currentEntries.map((entry) =>
          entry.id === id
            ? { ...entry, quantity: (entry.quantity ?? 0) + amount }
            : entry
        );
      }

      return [...currentEntries, { id, quantity: amount }];
    });
  };

  // 数量変更：0以下になったらカートから削除
  const update = (id, quantity) => {
    if (quantity <= 0) {
      remove(id);
    } else {
      setEntries(
        entries.map((entry) =>
          entry.id === id ? { ...entry, quantity } : entry
        )
      );
    }
  };

  // 削除
  const remove = (id) => setEntries(entries.filter((entry) => entry.id !== id));

  // カート内の合計個数（ヘッダーのバッジに使う）
  const total = entries.reduce((sum, entry) => sum + entry.quantity, 0);

  return { entries, add, update, remove, total };
}
