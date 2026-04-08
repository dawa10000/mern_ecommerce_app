import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router";
import { clearCart } from "../carts/cartSlice.js";
import { setOrderSuccess } from "../checkout/checkoutSlice.js";
import { toast } from "sonner";
import { STORAGE_KEY } from "../checkout/Checkout.jsx";
import { baseUrl } from "../../app/mainApi.js";

export default function PaymentSuccess() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { user } = useSelector((state) => state.userSlice);
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"

  useEffect(() => {
    const verify = async () => {
      const data = searchParams.get("data"); // eSewa sends base64 encoded data param

      if (!data) {
        setStatus("failed");
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/checkout/esewa-verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(user?.token && { Authorization: `Bearer ${user.token}` }),
          },
          body: JSON.stringify({ data }),
        });

        const result = await res.json();

        if (res.ok && result.order) {
          // ✅ Payment confirmed — now dispatch and clear
          dispatch(setOrderSuccess({ orderId: result.order._id, orderDetails: result.order }));
          dispatch(clearCart());
          localStorage.removeItem(STORAGE_KEY);
          toast.success("Payment successful!");
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, []);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm animate-pulse">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl">✕</div>
        <h1 className="text-3xl font-bold font-serif text-gray-900">Verification Failed</h1>
        <p className="text-gray-500 text-sm">We couldn't verify your payment. Please contact support.</p>
        <button onClick={() => nav("/checkout")}
          className="mt-4 border border-gray-800 text-gray-800 px-8 py-3 rounded hover:bg-gray-800 hover:text-white transition-colors text-sm">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">✓</div>
      <h1 className="text-3xl font-bold font-serif text-gray-900">Payment Successful!</h1>
      <p className="text-gray-500 text-sm">Your order has been placed and payment confirmed.</p>
      <button onClick={() => nav("/")}
        className="mt-4 border border-gray-800 text-gray-800 px-8 py-3 rounded hover:bg-gray-800 hover:text-white transition-colors text-sm">
        Continue Shopping
      </button>
    </div>
  );
}