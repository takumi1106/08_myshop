import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase.js";

async function syncItemsToFirestore() {
  const response = await fetch(`/items.json?t=${Date.now()}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("items.jsonを取得できませんでした");

  const { items } = await response.json();
  const itemIds = new Set(items.map((item) => item.id));
  const currentItems = await getDocs(collection(db, "items"));

  await Promise.all([
    ...items.map(({ id, ...fields }) =>
      setDoc(doc(db, "items", id), fields)
    ),
    ...currentItems.docs
      .filter((itemDoc) => !itemIds.has(itemDoc.id))
      .map((itemDoc) => deleteDoc(itemDoc.ref)),
  ]);

  console.info(`Firestoreを${items.length}件の商品で更新しました`);
}

async function startApp() {
  try {
    await syncItemsToFirestore();
  } catch (error) {
    console.error("Firestoreへの同期に失敗しました", error);
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

startApp();
