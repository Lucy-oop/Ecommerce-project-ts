import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // ✅ use react-router-dom
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import "./HomePage.css";

type Product = {
  id: string;
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number;
  keywords: string[];
};

type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  // if your cart API expands product, include it (optional)
  product?: Product;
};

type HomePageProps = {
  cart: CartItem[];
  loadCart: () => Promise<void>;
};

export function HomePage({ cart, loadCart }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search");

  useEffect(() => {
    const getHomeData = async () => {
      const urlPath = search ? `/api/products?search=${encodeURIComponent(search)}` : "/api/products";

      const response = await axios.get<Product[]>(urlPath);
      setProducts(response.data);
    };

    getHomeData();
  }, [search]);

  return (
    <>
      {/* ❗ Don’t put <title> / <link> inside component unless using Helmet */}
      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}
