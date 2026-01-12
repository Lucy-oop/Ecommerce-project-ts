type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  product?: {
    id: string;
    name: string;
    image: string;
    priceCents: number;
    rating: { stars: number; count: number };
    keywords: string[];
  };
};

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = async (): Promise<void> => {
    const response = await axios.get<CartItem[]>('/api/cart-items?expand=product');
    setCart(response.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage cart={cart} loadCart={loadCart} />} />
      <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />} />
      <Route path="orders" element={<OrdersPage cart={cart} loadCart={loadCart} />} />
      <Route path="tracking/:orderId/:productId" element={<TrackingPage cart={cart} />} />
      <Route path="*" element={<NotFoundPage cart={cart} />} />
    </Routes>
  );
}
