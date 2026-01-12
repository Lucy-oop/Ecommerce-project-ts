import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import { products } from "../../data/products"; // ✅ use local data
import "./HomePage.css";

import type { Product } from "../../data/products";

type CartItem = { productId: string; quantity: number; deliveryOptionId: string; product?: Product };

type HomePageProps = {
  cart: CartItem[];
  loadCart: () => Promise<void>;
};

export function HomePage({ cart, loadCart }: HomePageProps) {
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!search) return products;

    return products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(search);
      const keywordMatch = p.keywords?.some((k) => k.toLowerCase().includes(search));
      return nameMatch || keywordMatch;
    });
  }, [search]);

  return (
    <>
      <Header cart={cart} />
      <div className="home-page">
        <ProductsGrid products={filteredProducts} loadCart={loadCart} />
      </div>
    </>
  );
}
