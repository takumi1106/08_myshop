import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// src/pages/ItemDetail.jsx ※追加：既存のimportの下
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";


export default function ItemDetail({ favorites, cart }) {
  // URLパラメータを取得
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleFavorite = () => {
    if (favorites.has(id)) {
      favorites.remove(id);
    } else {
      favorites.add(id);
    }
  };

  const handleAddToCart = () => {
    cart.add(id, quantity);
  };

  const handleButtonEffect = () => {
    setIsExpanded(true);
  };

  // src/pages/ItemDetail.jsx
useEffect(() => {
  getDocs(collection(db, "items")).then((snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const found = data.find((i) => i.id === id);
    setItem(found ?? null);
    setSelectedImage(
      Array.isArray(found?.image)
        ? found.image[0]
        : found?.images?.[0] ?? found?.image ?? ""
    );
    setLoading(false);
  });
}, [id]);

  const images = item
    ? (Array.isArray(item.image) && item.image.length > 0
        ? item.image
        : Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : [item.image]
      ).filter(Boolean).slice(0, 4)
    : [];
  const isSoldOut = item?.status === "soldout" || item?.stock === 0;
  const maxQuantity = typeof item?.stock === "number" ? item.stock : 99;

  useEffect(() => {
    images.forEach((image) => {
      const preloadImage = new Image();
      preloadImage.src = image;
    });
  }, [item]);

  const showImage = (nextImage) => {
    setSelectedImage((currentImage) => {
      if (currentImage === nextImage) return currentImage;
      setPreviousImage(currentImage);
      return nextImage;
    });
  };

  useEffect(() => {
    if (!item) return undefined;

    const slideImages = (
      Array.isArray(item.image) && item.image.length > 0
        ? item.image
        : Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : [item.image]
    ).filter(Boolean).slice(0, 4);

    if (slideImages.length < 2) return undefined;

    const intervalId = window.setInterval(() => {
      setSelectedImage((currentImage) => {
        const currentIndex = slideImages.indexOf(currentImage);
        const nextIndex = (currentIndex + 1) % slideImages.length;
        setPreviousImage(currentImage);
        return slideImages[nextIndex];
      });
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [item]);

  if (loading) {
    return <p className="loading">読み込み中...</p>;
  }

  // アイテムが見つからなかった場合
  if (!item) {
    return (
      <div className="item-detail item-detail--notfound">
        <p>アイテムが見つかりません。</p>
        <Link to="/" className="item-detail__back">
          ← 一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="item-detail">
      <Link to="/" className="item-detail__back">
        ← 一覧へ戻る
      </Link>
      <div className="item-detail__media">
        <div className="item-detail__image">
          {previousImage && (
            <img
              className="item-detail__image-previous"
              src={previousImage}
              alt=""
              aria-hidden="true"
            />
          )}
          <img
            className="item-detail__image-current"
            key={selectedImage}
            src={selectedImage || (Array.isArray(item.image) ? item.image[0] : item.image)}
            alt={item.name}
            onAnimationEnd={() => setPreviousImage("")}
          />
          {isSoldOut && <span className="item-detail__badge">soldout</span>}
        </div>

        <div className="item-detail__thumbnails">
          {images.map((image, index) => (
            <button
              type="button"
              className={`item-detail__thumbnail ${
                selectedImage === image ? "is-active" : ""
              }`}
              onClick={() => showImage(image)}
              aria-label={`${index + 1}枚目の画像を表示`}
              key={image}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      </div>
      <div className="item-detail__body">
        <p className="item-detail__category">{item.category}</p>
        <h2 className="item-detail__name">{item.name}</h2>
        <p className="item-detail__price">
          <span>¥{item.price.toLocaleString()}</span>
          {typeof item.stock === "number" && (
            <span className={`item-stock${item.stock === 0 ? " is-empty" : ""}`}>
              {item.stock === 0 ? "在庫なし" : `残り${item.stock}点`}
            </span>
          )}
        </p>
        <p className="item-detail__description">{item.description}</p>
        <dl className="item-detail__specs">
          <div className="item-detail__spec">
            <dt>品　番</dt>
            <dd>{item.code}</dd>
          </div>
          <div className="item-detail__spec">
            <dt>カラー</dt>
            <dd>{item.color}</dd>
          </div>
          <div className="item-detail__spec">
            <dt>サイズ</dt>
            <dd>{item.size}</dd>
          </div>
        </dl>
        {!isSoldOut && (
          <div className="item-detail__quantity">
            <span>数量</span>
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              aria-label="数量を1つ減らす"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => {
                const nextQuantity = Number(e.target.value);
                setQuantity(Math.min(maxQuantity, Math.max(1, nextQuantity || 1)));
              }}
              aria-label="カートに入れる数量"
            />
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
              aria-label="数量を1つ増やす"
            >
              ＋
            </button>
          </div>
        )}
        <div
          className={`item-card__btn itemDetail__btn ${isExpanded ? "is-clicked" : ""}`}
          onClick={handleButtonEffect}
          onAnimationEnd={() => setIsExpanded(false)}
        >
          <button
            type="button"
            className="item-card__cart itemDetail__cart"
            onClick={handleAddToCart}
            disabled={isSoldOut}
          >
            {isSoldOut ? (
              "売り切れ"
            ) : (
              <>
              ADD TO CART
              </>
            )}
          </button>
          <button
            type="button"
            className={
              favorites.has(item.id)
                ? "item-card__fav itemDetail__fav is-active"
                : "item-card__fav itemDetail__fav"
            }
            onClick={handleFavorite}
          >
            {favorites.has(item.id) ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
