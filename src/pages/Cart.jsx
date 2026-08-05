// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// src/pages/Cart.jsx ※追加：既存のimportの下
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";


export default function Cart({ cart }) {
  const [items, setItems] = useState([]);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  // src/pages/Cart.jsx
useEffect(() => {
  getDocs(collection(db, "items")).then((snapshot) => {
    setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
}, []);


  // カートのエントリ（id・数量）に、items.jsonの商品情報を合体させる
  const rows = cart.entries
    .map((entry) => {
      const item = items.find((i) => i.id === entry.id);
      return item ? { ...item, quantity: entry.quantity } : null;
    })
    .filter((row) => row !== null);

  // 合計金額（単価 × 数量 の合計）
  const totalPrice = rows.reduce((sum, row) => sum + row.price * row.quantity, 0);
  const canPurchase =
    rows.length === cart.entries.length &&
    rows.length > 0 &&
    rows.every((row) =>
      typeof row.stock !== "number" || row.quantity <= row.stock
    );

  const handlePurchase = () => {
    if (!canPurchase) return;
    if (!window.confirm(`合計¥${totalPrice.toLocaleString()}で購入しますか？`)) return;

    cart.clear();
    setPurchaseComplete(true);
  };

  if (purchaseComplete) {
    return (
      <div className="page-placeholder cart-complete">
        <p className="cart-complete__eyebrow">ORDER COMPLETE</p>
        <h2>ご購入ありがとうございます</h2>
        <p>ご注文を受け付けました。</p>
        <Link to="/" className="cart-complete__back">商品一覧へ戻る</Link>
      </div>
    );
  }

  if (cart.entries.length === 0) {
    return (
      <div className="page-placeholder">
        <h2>cart</h2>
        <p>
          カートは空です。<Link to="/">一覧へ戻る</Link>
        </p>
      </div>
    );
  }

  return (
    <section className="cart">
      <h2>カート</h2>
      <ul className="cart-list">
        {rows.map((row) => (
          <li key={row.id} className="cart-row">
            <img
              src={Array.isArray(row.image) ? row.image[0] : row.image}
              alt={row.name}
            />
            <div className="cart-row__info">
              <h3 className="item-card__name">{row.name}</h3>
              <p className="item-card__price cart__price">¥{row.price.toLocaleString()}</p>
            </div>
            <div className="cart-row__quantity item-card__quantity-picker">
              <button type="button" onClick={() => cart.update(row.id, row.quantity - 1)}>−</button>
              <span>{row.quantity}</span>
              <button type="button" onClick={() => cart.update(row.id, row.quantity + 1)}>＋</button>
            </div>
            <p className="cart-row__subtotal">
              <span className="cart-row__subtotal-label">合計金額:</span>
              <span className="cart-row__subtotal-price">
                ¥{(row.price * row.quantity).toLocaleString()}
              </span>
            </p>
            <button className="cart-delete" type="button" onClick={() => cart.remove(row.id)}>削除</button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <p className="cart-total">合計：¥{totalPrice.toLocaleString()}</p>
        {!canPurchase && rows.length > 0 && (
          <p className="cart-summary__error">
            在庫数を超えている商品があります。数量を変更してください。
          </p>
        )}
        <button
          type="button"
          className="cart-purchase"
          onClick={handlePurchase}
          disabled={!canPurchase}
        >
          購入する
        </button>
      </div>
    </section>
  );
}
