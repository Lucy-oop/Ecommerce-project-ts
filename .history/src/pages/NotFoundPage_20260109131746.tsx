import "./NotFoundPage.css";
import { Header } from "../components/Header";

export function NotFoundPage({ cart }: { cart: Array<{ quantity: number }> }) {
  return (
    <>
      <Header cart={cart} />
      <div className="not-found-message">Page not found</div>
    </>
  );
}
