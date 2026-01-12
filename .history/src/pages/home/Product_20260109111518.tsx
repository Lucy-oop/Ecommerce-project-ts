import axios from "axios";
import { useState } from "react";
import { formatMoney } from "../../utlis/money";
import CheckmarkIcon from "../../assets/images/icons/checkmark.png";

type ProductType = {
  id: string;
  image: string;
  name: string;
  rating: {
    stars: number;
    count: number;
  };
  priceCents: number;
};

type ProductProps = {
  product: ProductType;
  loadCart: () => Promise<void>;
};

export function Product({ product, loadCart }: ProductProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [showAddMessage, setShowAddMessage] = useState<boolean>(false);

  const addToCart = async (): Promise<void> => {
    await axios.post("/api/cart-items", {
      productId: product.id,
      quantity,
    });

    await loadCart();

    setShowAddMessage(true);
    setTimeout(() => {
      setShowAddMessage(false);
    }, 2000);
  };

  const selectQuantity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(event.target.value));
  };

  return (
    <div className="product-container" data-testid="product-container">
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-name limit-text-to-2-lines">
        {product.name}
      </div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`images/ratings/rating-${product.rating.stars * 10}.png`}
          alt="rating"
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">
        {formatMoney(product.priceCents)}
      </div>

      <div
        className="product-quantity-container"
        data-testid="product-quantity-selector"
      >
        <select value={quantity} onChange={selectQuantity}>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="product-spacer"></div>

      <div
        className="added-to-cart"
        style={{ opacity: showAddMessage ? 1 : 0 }}
      >
        <img src={CheckmarkIcon} alt="Added" />
        Added
      </div>

      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={addToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
