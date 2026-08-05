import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

const INITIAL_COUNT = 9;
const STEP = 9;

export default function Home({ favorites, cart }) {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    getDocs(collection(db, "items"))
      .then((snapshot) => {
        const itemList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(itemList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("商品データの取得に失敗しました", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="loading">読み込み中...</p>;
  }

  const categories = [...new Set(items.map((item) => item.category))];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const searchableText = [
      item.name,
      item.category,
      item.description,
      item.code,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesCategory && searchableText.includes(normalizedQuery);
  });
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setVisibleCount(INITIAL_COUNT);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <div className="home">
      <h2 className="home__title">Products</h2>

      <div className="home__filters" role="search">
        <label className="home__search">
          <span className="visually-hidden">商品を検索</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 4 4" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="商品を検索"
          />
        </label>

        <label className="home__category">
          <span className="visually-hidden">カテゴリで絞り込む</span>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="all">すべてのカテゴリ</option>
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleItems.length > 0 ? (
        <ul className="home__list">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <ItemCard
                item={item}
                favorites={favorites}
                cart={cart}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="home__empty">
          <p>条件に一致する商品がありません。</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            条件をクリア
          </button>
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          className="home__more"
          onClick={() => setVisibleCount((count) => count + STEP)}
        >
          more
        </button>
      )}
    </div>
  );
}
