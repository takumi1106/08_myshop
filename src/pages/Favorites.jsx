// src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard.jsx";

export default function Favorites({ favorites, cart }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/items.json")
      .then((res) => res.json())
      .then((data) => setItems(data.items));
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
