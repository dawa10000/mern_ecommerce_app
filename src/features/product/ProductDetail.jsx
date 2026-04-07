import { useNavigate, useParams } from "react-router"
import { useGetProductQuery } from "./productApi.js";
import { getRating } from "../../lib/rating.js";
import { Button } from "../../components/ui/button.jsx";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../carts/cartSlice.js";
import ReviewForm from "../reviews/ReviewForm.jsx";
import ReviewList from "../reviews/ReviewList.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useSelector(state => state.userSlice);
  const { cart } = useSelector(state => state.cartSlice);
  const isExist = cart.find(item => item.id === id);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { data, isLoading, error } = useGetProductQuery(id);
  const [count, setCount] = useState(isExist ? isExist.quantity : 1);
  const [index, setIndex] = useState(0);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.data?.message}</p>;


  const handleCart = (product) => {
    dispatch(setCart({
      id: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      quantity: count
    }));
    nav('/order-place');
  }



  return (
    <div>
      <div className="grid grid-cols-[1fr_2fr] gap-10 p-5">

        <div>
          <img className="h-56 w-full object-cover" src={data.image[index].url} alt="" />

          <div className="flex gap-2 w-full py-3 overflow-x-scroll">
            {data.image.map((img, i) => {
              return <img

                onMouseEnter={() => setIndex(i)}
                className="h-20 hover:border-2 hover:border-yellow-600" key={i} src={img.url} alt="" />
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h1>{data.title}</h1>
          <p className="text-[#F57224] font-semibold text-xl">Rs.{data.price}</p>
          <p>{data.rating === 0 ? 'No Rating' : getRating(data.rating)}</p>

          <div className="flex items-center gap-5 mt-10">

            <Button
              disabled={count === 1}
              onClick={() => setCount(count - 1)}
              variant="outline">
              <MinusIcon />
            </Button>


            <p>{count}</p>

            <Button
              disabled={count === data.stock}
              onClick={() => setCount(count + 1)}
              variant="outline">  <PlusIcon /></Button>


          </div>

          <Button
            disabled={!user}
            onClick={() => handleCart(data)} className="mt-5">Add To Cart</Button>
        </div>

      </div>


      <div className="mt-20">

        <h3 className="font-normal">Description</h3>
        <p className="my-2 text-gray-700">{data.detail}</p>

      </div>


      {user && user?.role === 'user' && <ReviewForm id={data._id} />}

      <ReviewList id={data._id} />


    </div>
  )
}
