// src/components/ItemCard.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ItemCard({ item, favorites, cart }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleFavorite = (e) => {
    e.preventDefault(); // 親の<Link>による画面遷移を止める
    if (favorites.has(item.id)) {
      favorites.remove(item.id);
    } else {
      favorites.add(item.id);
    }
  };

  const handleOpenQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuantityOpen(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cart.add(item.id, quantity);
    setQuantity(1);
    setIsQuantityOpen(false);
  };

  const handleButtonEffect = (e) => {
    e.preventDefault();
    setIsExpanded(true);
  };

  return (
    <Link to={`/items/${item.id}`} className="item-card">
      <div className="item-card__image">
        <img src={item.image} alt={item.name} />
        {item.status === "soldout" && (
          <span className="item-card__badge">SOLD OUT</span>
        )}
      </div>
      <h3 className="item-card__name">{item.name}</h3>
      <p className="item-card__price">¥{item.price.toLocaleString()}</p>
      <div
        className={`item-card__btn ${isExpanded ? "is-clicked" : ""}`}
        onClick={handleButtonEffect}
        onAnimationEnd={() => setIsExpanded(false)}
      >
        {item.status === "soldout" ? (
          <button
            type="button"
            className="item-card__cart"
            disabled
          >
            売り切れ
          </button>
        ) : isQuantityOpen ? (
          <div className="item-card__quantity-picker">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuantity((current) => Math.max(1, current - 1));
              }}
              aria-label="数量を1つ減らす"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onChange={(e) => {
                const nextQuantity = Number(e.target.value);
                setQuantity(Math.min(99, Math.max(1, nextQuantity || 1)));
              }}
              aria-label="カートに入れる数量"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuantity((current) => Math.min(99, current + 1));
              }}
              aria-label="数量を1つ増やす"
            >
              ＋
            </button>
            <button
              type="button"
              className="item-card__quantity-add"
              onClick={handleAddToCart}
            >
              追加
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="item-card__cart"
            onClick={handleOpenQuantity}
          >
            <span
              className="site-header__cart-icon cart-icon"
              aria-hidden="true"
            >
              🛒
            </span>
            カートに入れる
          </button>
        )}
        <button
          type="button"
          className={
            favorites.has(item.id)
              ? "item-card__fav is-active"
              : "item-card__fav"
          }
          onClick={handleFavorite}
        >
          {favorites.has(item.id) ? "♥" : "♡"}
        </button>
      </div>
    </Link>
  );
}
