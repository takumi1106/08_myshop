// src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard.jsx";
// src/pages/Favorites.jsx ※追加：既存のimportの下
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";


export default function Favorites({ favorites, cart }) {
  const [items, setItems] = useState([]);

  // src/pages/Favorites.jsx
useEffect(() => {
  getDocs(collection(db, "items")).then((snapshot) => {
    setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
}, []);


  // 全アイテムから、お気に入りIDに含まれるものだけを残す
  const favItems = items.filter((item) => favorites.ids.includes(item.id));

  if (favItems.length === 0) {
    return (
      <div className="page-placeholder">
        <h2>favorites</h2>
        <p>お気に入りはまだありません。</p>
      </div>
    );
  }

  return (
    <div className="home">
      <h2 className="home__title">favorites</h2>
      <ul className="home__list">
        {favItems.map((item) => (
          <li key={item.id}>
            <ItemCard item={item} favorites={favorites} cart={cart} />
          </li>
        ))}
      </ul>
    </div>
  );
}
