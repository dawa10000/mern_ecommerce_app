import { useNavigate, useSearchParams } from "react-router"
import { useGetProductsQuery } from "../product/productApi.js";
import { getRating } from "../../lib/rating.js";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const nav = useNavigate();
  const { data, isLoading, error } = useGetProductsQuery({
    search: searchParams.get('q')
  });

  if (isLoading) return <p>Loading...</p>;
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
