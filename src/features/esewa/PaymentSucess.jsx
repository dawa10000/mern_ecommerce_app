import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router";
import { clearCart } from "../carts/cartSlice.js";
import { toast } from "sonner";
import { STORAGE_KEY } from "../checkout/Checkout.jsx"; // ✅ shared constant

export default function PaymentSuccess() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("order");

  useEffect(() => {
    dispatch(clearCart());
    localStorage.removeItem(STORAGE_KEY); // ✅ uses shared constant
    toast.success("Payment successful!");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">✓</div>
      <h1 className="text-3xl font-bold font-serif text-gray-900">Payment Successful!</h1>
      <p className="text-gray-500 text-sm">Your order has been placed and payment confirmed.</p>
      {orderId && <p className="text-xs text-gray-400 font-mono">Order ID: {orderId}</p>}
      <button onClick={() => nav("/shop")}
        className="mt-4 border border-gray-800 text-gray-800 px-8 py-3 rounded hover:bg-gray-800 hover:text-white transition-colors text-sm">
        Continue Shopping
      </button>
    </div>
  );
}