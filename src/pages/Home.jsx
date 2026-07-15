import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard.jsx";

const INITIAL_COUNT = 9;
const STEP = 9;

export default function Home() {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/items.json")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="loading">読み込み中...</p>;
  }

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div className="home">
      <h2 className="home__title">item</h2>
      <ul className="home__list">
        {visibleItems.map((item) => (
          <li key={item.id}>
            <ItemCard item={item} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          className="home__more"
          onClick={() => setVisibleCount((c) => c + STEP)}
        >
          more
        </button>
      )}
    </div>
  );
}
