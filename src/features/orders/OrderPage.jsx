import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useGetMyOrdersQuery, useCancelOrderMutation } from "./orderApi.js";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function OrderHero() {
  return (
    <div className="relative bg-gray-200 h-40 sm:h-56 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 opacity-80" />
      <div className="absolute inset-0 flex items-end justify-around pb-4 px-8 opacity-20">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-16 h-12 bg-amber-200 rounded-sm" />
        ))}
      </div>
      <div className="relative z-10 text-center">
        <div className="flex justify-center mb-1">
          <svg viewBox="0 0 40 30" className="w-8 h-8" fill="none">
            <path d="M20 2 L36 26 H4 Z" fill="none" stroke="#B8960C" strokeWidth="2.5" />
            <path d="M20 10 L30 26 H10 Z" fill="#B8960C" opacity="0.4" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">My Orders</h1>
        <p className="text-sm text-gray-600 mt-1">
          <span className="hover:text-yellow-700 cursor-pointer">Home</span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-800 font-medium">My Orders</span>
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

const NON_CANCELLABLE = ["shipped", "delivered", "cancelled"];

export default function OrderPage() {
  const { user } = useSelector((state) => state.userSlice);
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery(user?.token);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();


  const [confirmOrderId, setConfirmOrderId] = useState(null);

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder({ id: confirmOrderId, token: user?.token }).unwrap();
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel order");
    } finally {
      setConfirmOrderId(null);
    }
  };

  if (isLoading)
    return (
      <>
        <OrderHero />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-semibold animate-pulse text-gray-500">Loading orders...</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <OrderHero />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500 font-medium">{error?.data?.message || "Something went wrong"}</p>
        </div>
      </>
    );

  if (!orders.length)
    return (
      <>
        <OrderHero />
        <div className="min-h-screen flex items-center justify-center flex-col gap-3">
          <p className="text-gray-400 text-lg">No orders found.</p>
          <a href="/shop" className="text-sm underline text-gray-600 hover:text-black">
            Continue Shopping
          </a>
        </div>
      </>
    );

  return (
    <div>
      <OrderHero />

      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 font-serif text-gray-900">
            My Orders ({orders.length})
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => {
              const canCancel = !NON_CANCELLABLE.includes(order.status);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>

                  {/* Billing Info */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-600 space-y-1">
                    <p><span className="font-semibold text-gray-800">Name: </span>{order.firstName} {order.lastName}</p>
                    <p><span className="font-semibold text-gray-800">Email: </span>{order.email}</p>
                    <p><span className="font-semibold text-gray-800">Phone: </span>{order.phone}</p>
                    <p><span className="font-semibold text-gray-800">Address: </span>{order.street}, {order.city}, {order.province} {order.zip}</p>
                    <p><span className="font-semibold text-gray-800">Payment: </span>{order.paymentMethod}</p>
                  </div>

                  {/* Products */}
                  <div className="space-y-3 mb-4 flex-1">
                    {order.products.map((p) => (
                      <div key={p._id} className="flex gap-3 border rounded-xl p-3">
                        <img
                          src={p.product?.image?.[0].url}
                          alt={p.product?.title}
                          className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
                          onError={(e) => { e.target.src = "https://placehold.co/64x64?text=No+Image"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm line-clamp-1">{p.product?.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{p.product?.detail}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              Qty: {p.quantity}
                            </span>
                            <span className="text-sm font-semibold text-gray-800">
                              Rs. {(p.product?.price * p.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-base font-bold text-gray-900">
                        Rs. {order.total?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>


                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => setConfirmOrderId(order._id)}
                      disabled={isCancelling && confirmOrderId === order._id}
                      className="mt-4 w-full text-sm border border-red-300 text-red-500 py-2 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmOrderId} onOpenChange={(open) => { if (!open) setConfirmOrderId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl">Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600">
              Are you sure you want to cancel this order? This action cannot be undone.
              {confirmOrderId && (
                <span className="block mt-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded w-fit">
                  #{confirmOrderId.slice(-6).toUpperCase()}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-sm border-gray-300">Go Back</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="text-sm bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}