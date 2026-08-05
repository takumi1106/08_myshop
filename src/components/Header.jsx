import { Link, NavLink } from "react-router-dom";

export default function Header({ cart }) {
  const cartCount = cart.total;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo">
            SHOPPER+
        </Link>

        <nav className="site-header__nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/favorites">Favorites</NavLink>
        </nav>

        <Link to="/cart" className="site-header__cart" aria-label="カート">
          <span className="site-header__cart-icon" aria-hidden="true">
            🛒
          </span>
          <span className="site-header__cart-badge">{cartCount}</span>
        </Link>
      </div>

      {/* <p className="site-header__lead">
        header部分は、自由にデザインしてください。
      </p> */}
    </header>
  );
}
