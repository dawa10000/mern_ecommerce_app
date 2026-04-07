import { useState } from "react";
import { useGetProductsQuery } from "../product/productApi.js";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button.jsx";
import ProductList from "./ProductList.jsx";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const nav = useNavigate();
  const { data } = useGetProductsQuery({ page, limit: 12 });

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