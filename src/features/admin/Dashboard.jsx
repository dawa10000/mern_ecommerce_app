import { useState } from "react";
import { useGetProductsQuery } from "../product/productApi.js";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button.jsx";
import ProductList from "./ProductList.jsx";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const nav = useNavigate();
  const { data, isLoading } = useGetProductsQuery({ page, limit: 12 });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-64 bg-gray-200 rounded-lg mb-2 animate-pulse" />
        <div className="flex flex-wrap gap-6 mt-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-96 h-80 rounded-2xl bg-[#1f2b6c]/20 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className='p-5 mt-5'>
      <Button onClick={() => nav('/product-add')}>Add Product</Button>

      <ProductList page={page} limit={12} />

      <div className="flex items-center justify-end gap-3 mt-4">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </Button>
        <span className="text-sm">Page {page} of {data?.totalPages}</span>
        <Button
          variant="outline"
          disabled={page === data?.totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}