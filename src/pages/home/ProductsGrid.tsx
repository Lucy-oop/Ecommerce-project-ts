import { Product } from "./Product";

type ProductType = {
  id: string;
  image: string;
  name: string;
  rating: { stars: number; count: number };
  priceCents: number;
  keywords: string[];
};

type ProductsGridProps = {
  products: ProductType[];
  loadCart: () => Promise<void>; // ✅ always Promise
};

export function ProductsGrid({ products, loadCart }: ProductsGridProps) {
  if (!Array.isArray(products)) {
    return <div style={{ padding: 20 }}>Products data is not an array.</div>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <Product key={product.id} product={product} loadCart={loadCart} />
      ))}
    </div>
  );
}
