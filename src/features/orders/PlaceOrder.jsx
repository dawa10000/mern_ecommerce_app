import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/ui/button.jsx";
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from "lucide-react";
import { clearCart, removeSingle, setCart } from "../carts/cartSlice.js";
import { useNavigate } from "react-router";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { cart } = useSelector((state) => state.cartSlice);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatPrice = (amount) =>
    `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  if (cart.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <ShoppingCartIcon className="w-16 h-16 text-gray-300" />
        <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm">Add some products to continue shopping</p>
        <Button onClick={() => nav("/shop")} variant="outline">
          Continue Shopping
        </Button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 font-serif text-gray-900">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-10">


        <div className="flex-1 space-y-4">


          <div className="hidden md:grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b pb-2">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-center">Price</span>
            <span className="text-center">Action</span>
          </div>


          {cart.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 border rounded-xl p-4 bg-white shadow-sm"
            >

              <div className="flex items-center gap-3">
                <img
                  src={product.image?.[0].url}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/64x64?text=No+Image";
                  }}
                />
                <div>
                  <p className="font-medium text-sm text-gray-800 line-clamp-2">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatPrice(product.price)} each
                  </p>
                </div>
              </div>


              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={() =>
                    dispatch(setCart({ ...product, quantity: product.quantity - 1 }))
                  }
                  disabled={product.quantity === 1}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                >
                  <MinusIcon className="w-3 h-3" />
                </Button>

                <span className="w-8 text-center font-semibold text-sm">
                  {product.quantity}
                </span>

                <Button
                  onClick={() =>
                    dispatch(setCart({ ...product, quantity: product.quantity + 1 }))
                  }
                  disabled={product.quantity >= product.stock}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                >
                  <PlusIcon className="w-3 h-3" />
                </Button>
              </div>

              <div className="text-center">
                <p className="font-semibold text-gray-800 text-sm">
                  {formatPrice(product.price * product.quantity)}
                </p>
              </div>


              <div className="flex justify-center">
                <Button
                  onClick={() => dispatch(removeSingle(product))}
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 text-red-500 hover:text-red-600 hover:border-red-300"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}


          <div className="flex justify-end pt-2">
            <Button
              onClick={() => dispatch(clearCart())}
              variant="ghost"
              className="text-red-500 hover:text-red-600 text-sm"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Clear Cart
            </Button>
          </div>
        </div>


        <div className="w-full lg:w-72 bg-white border rounded-2xl p-6 shadow-sm h-fit sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span className="line-clamp-1 flex-1 mr-2">{item.title} × {item.quantity}</span>
                <span className="font-medium whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-yellow-600">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Button
            onClick={() => nav('/checkout')}
            className="w-full bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            Proceed to Checkout
          </Button>

          <Button
            onClick={() => nav('/shop')}
            variant="ghost"
            className="w-full mt-2 text-sm text-gray-500"
          >
            Continue Shopping
          </Button>
        </div>

      </div>
    </div>
  );
}