import './NotFoundPage.css';
import { Header } from '../components/Header';

/* ---------- Types ---------- */

interface CartItem {
  productId: string;
  quantity: number;
}

interface NotFoundPageProps {
  cart: CartItem[];
}

/* ---------- Component ---------- */

export function NotFoundPage({ cart }: NotFoundPageProps) {
  return (
    <>
      <title>404 Page Not Found</title>
      <link rel="icon" href="home-favicon.png" type="image/svg+xml" />

      {/* ✅ Fixed: Header (not Head) */}
      <Header cart={cart} />

      <div className="not-found-message">
        Page not found
      </div>
    </>
  );
}
