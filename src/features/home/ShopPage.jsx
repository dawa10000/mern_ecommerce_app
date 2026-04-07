import { useNavigate, useSearchParams } from "react-router";
import { getRating } from "../../lib/rating.js";
import { Button } from "../../components/ui/button.jsx";
import { useEffect } from "react";
import { useGetProductsQuery } from "../product/productApi.js";

function ShopHero() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">Shop</h1>
        <p className="text-sm text-gray-600 mt-1">
          <span className="hover:text-yellow-700 cursor-pointer">Home</span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-800 font-medium">Shop</span>
        </p>
      </div>
    </div>
  );
}


const SORT_OPTIONS = [
  { label: "Latest", value: "-createdAt" },
  { label: "Top Rated", value: "-rating" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const sort = searchParams.get("sort") || "-createdAt";
  const nav = useNavigate();

  const { isLoading, data, error } = useGetProductsQuery({
    page: Number(page),
    sort,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleSort = (value) => {
    setSearchParams({ page: 1, sort: value });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 animate-pulse text-lg">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error.data?.message}</p>
    </div>
  );

  return (
    <div>
      <ShopHero />

      {/*  Sort Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-800">{data.products.length}</span> products
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 max-w-7xl mx-auto px-6 py-6">
        {data.products.map((product) => {
          const outOfStock = product.stock === 0;
          const lowStock = !outOfStock && product.stock <= 5;

          return (
            <div
              key={product._id}
              onClick={() => !outOfStock && nav(`/product/${product._id}`)}
              className={`shadow-lg hover:shadow-xl space-y-2 relative rounded-lg overflow-hidden transition-all duration-200 ${outOfStock
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:-translate-y-1"
                }`}
            >
              {outOfStock && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                  Out of Stock
                </div>
              )}
              {lowStock && (
                <div className="absolute top-2 left-2 z-10 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                  Only {product.stock} left
                </div>
              )}
              <img
                className="h-60 object-cover w-full"
                src={product.image[0].url}
                alt={product.title}
                onError={(e) => { e.target.src = "https://placehold.co/400x240?text=No+Image"; }}
              />
              <div className="p-3">
                <p className="font-semibold text-gray-800 line-clamp-1">{product.title}</p>
                <p className="text-red-500 font-medium mt-1">
                  Rs. {product.price.toLocaleString("en-IN")}
                </p>
                <p className="mt-1">{getRating(product.rating)}</p>
                {outOfStock ? (
                  <p className="text-xs text-red-400 mt-1 font-medium">Currently unavailable</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">{product.stock} in stock</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-5 my-8">
        <Button
          onClick={() => setSearchParams({ page: Number(page) - 1, sort })}
          disabled={Number(page) === 1}
          variant="outline"
        >
          Prev
        </Button>
        <span className="text-sm font-medium text-gray-700">
          Page {page} of {data.totalPages}
        </span>
        <Button
          onClick={() => setSearchParams({ page: Number(page) + 1, sort })}
          disabled={Number(page) === data.totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}