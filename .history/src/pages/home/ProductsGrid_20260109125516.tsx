import { Product } from "./Product";

/* ---------- Types ---------- */

export interface ProductType {
  id: string;
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number;
  keywords: string[];
}

interface ProductsGridProps {
  products: ProductType[];
  loadCart: () => Promise<void>;
}

/* ---------- Component ---------- */

export function ProductsGrid({ products, loadCart }: ProductsGridProps) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <Product
          key={product.id}
          product={product}
          loadCart={loadCart}
        />
      ))}
    </div>
  );
}
