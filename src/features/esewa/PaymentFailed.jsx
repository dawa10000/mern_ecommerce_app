// pages/PaymentFailed.jsx
import { useNavigate } from "react-router";

export default function PaymentFailed() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl">✕</div>
      <h1 className="text-3xl font-bold font-serif text-gray-900">Payment Failed</h1>
      <p className="text-gray-500 text-sm">Something went wrong with your payment. Please try again.</p>
      <button onClick={() => nav("/checkout")}
        className="mt-4 border border-gray-800 text-gray-800 px-8 py-3 rounded hover:bg-gray-800 hover:text-white transition-colors text-sm">
        Try Again
      </button>
    </div>
  );
}