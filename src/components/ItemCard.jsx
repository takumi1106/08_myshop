// src/components/ItemCard.jsx
import { Link } from "react-router-dom";

export default function ItemCard({ item, favorites, cart }) {
  const handleFavorite = (e) => {
    e.preventDefault(); // 親の<Link>による画面遷移を止める
    if (favorites.has(item.id)) {
      favorites.remove(item.id);
    } else {
      favorites.add(item.id);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    cart.add(item.id);
  };


  return (
    <Link to={`/items/${item.id}`} className="item-card">
      <div className="item-card__image">
        <img src={item.image} alt={item.name} />
        {item.status === "soldout" && (
          <span className="item-card__badge">soldout</span>
        )}
      </div>
      <h3 className="item-card__name">{item.name}</h3>
      <p className="item-card__price">¥{item.price.toLocaleString()}</p>
      <button
        type="button"
        className={
          favorites.has(item.id) ? "item-card__fav is-active" : "item-card__fav"
        }
        onClick={handleFavorite}
      >
        ♡
      </button>
      <button
        type="button"
        className="item-card__cart"
        onClick={handleAddToCart}
        disabled={item.status === "soldout"}
      >
        カートに入れる
      </button>

    </Link>
  );
}
