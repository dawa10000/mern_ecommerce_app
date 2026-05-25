import { useNavigate, useSearchParams } from "react-router"
import { useGetProductsQuery } from "../product/productApi.js";
import { getRating } from "../../lib/rating.js";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const nav = useNavigate();
  const { data, isLoading, error } = useGetProductsQuery({
    search: searchParams.get('q')
  });

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
  if (error) return <p>{error.data?.message}</p>;
  console.log(data);

  return (
    <div>
      {data.products.length === 0 ? <p>No results found</p> : <div className="grid grid-cols-5 gap-5">
        {data.products.map((product) => {
          return <div
            onClick={() => nav(`/product/${product._id}`)}
            key={product._id} className="shadow-lg hover:shadow-xl space-y-2 cursor-pointer">
            <img
              className="h-60 object-cover w-full"
              src={product.image[0].url} alt="" />
            <div className="p-2">
              <p className="font-semibold">{product.title}</p>
              <p className="text-red-500">Rs.{product.price}</p>
              <p>{getRating(product.rating)}</p>

            </div>


          </div>
        })}
      </div>}
    </div>
  )
}
