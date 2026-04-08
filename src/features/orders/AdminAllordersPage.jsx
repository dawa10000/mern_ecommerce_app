import { useState } from "react";
import { useSelector } from "react-redux";


import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "./adminAllOrdersApi.js";



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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">All Orders</h1>
        <p className="text-sm text-gray-600 mt-1">
          <span className="hover:text-yellow-700 cursor-pointer">Dashboard</span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-800 font-medium">All Orders</span>
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


function StatusSelect({ orderId, currentStatus, token }) {
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [selected, setSelected] = useState(currentStatus);

  async function handleChange(e) {
    const newStatus = e.target.value;
    setSelected(newStatus);
    try {
      await updateOrderStatus({ token, orderId, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
      setSelected(currentStatus);
    }
  }

  return (
    <select
      value={selected}
      onChange={handleChange}
      disabled={isLoading}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 font-medium capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
    >
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}


const TABS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export default function AllOrdersPage() {
  const { user } = useSelector((state) => state.userSlice);
  const { data: orders = [], isLoading, error } = useGetAllOrdersQuery(user?.token);
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status === activeTab);


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
        </div>
      </>
    );

  return (
    <div>
      <OrderHero />

      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-6xl mx-auto">


          <h2 className="text-2xl font-bold mb-6 font-serif text-gray-900">
            All Orders ({orders.length})
          </h2>


          <div className="flex gap-2 flex-wrap mb-8 border-b border-gray-200 pb-0">
            {TABS.map((tab) => {
              const count = tab === "all" ? orders.length : orders.filter((o) => o.status === tab).length;
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize text-sm font-semibold px-4 py-2 border-b-2 transition-colors ${active
                    ? "border-yellow-600 text-yellow-700"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab}
                  <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>


          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition"
              >

                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-800">Name: </span>
                    {order.firstName} {order.lastName}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Email: </span>
                    {order.email}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Phone: </span>
                    {order.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Address: </span>
                    {order.street}, {order.city}, {order.province} {order.zip}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Payment: </span>
                    {order.paymentMethod}
                  </p>
                </div>


                <div className="space-y-3 mb-4">
                  {order.products.map((p) => (
                    <div key={p._id} className="flex gap-3 border rounded-xl p-3">
                      <img
                        src={p.product?.image?.[0].url}
                        alt={p.product?.title}
                        className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/64x64?text=No+Image";
                        }}
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


                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <StatusSelect
                      orderId={order._id}
                      currentStatus={order.status}
                      token={user?.token}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-base font-bold text-gray-900">
                      Rs. {order.total?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex justify-center py-20">
              <p className="text-gray-400 text-lg">No orders in this category.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}