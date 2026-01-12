import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import { products as allProducts, type Product } from "../../data/products";
import "./HomePage.css";

type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  product?: Product;
};

type HomePageProps = {
  cart: CartItem[];
  loadCart: () => Promise<void>;
};

export function HomePage({ cart, loadCart }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("search") || "").toLowerCase().trim();

  useEffect(() => {
    if (!search) {
      setProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter((p) => {
      const inName = p.name.toLowerCase().includes(search);
      const inKeywords = p.keywords.some((k) => k.toLowerCase().includes(search));
      return inName || inKeywords;
    });

    setProducts(filtered);
  }, [search]);

  return (
    <>
      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}

