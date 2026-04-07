import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { Spinner } from "../../components/ui/spinner.jsx";
import { toast } from "sonner";
import { Textarea } from "../../components/ui/textarea.jsx";
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../product/productApi.js";
import { useSelector } from "react-redux";


const productSchema = Yup.object({
  title: Yup.string().min(4).max(50).required(),
  detail: Yup.string().min(10).max(1000).required(),
  price: Yup.number().required(),
  category: Yup.string().required(),
  stock: Yup.number().required(),
});

export default function ProductEditForm() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.userSlice);
  const { data, isLoading: isLoad, error } = useGetProductQuery(id);

  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const nav = useNavigate();

  if (isLoad) return <Spinner />;
  if (error) return <p>{error.data?.message}</p>;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>Update product info</CardDescription>
      </CardHeader>

      <CardContent>
        <Formik
          enableReinitialize
          initialValues={{
            title: data.title,
            detail: data.detail,
            price: data.price,
            category: data.category,
            stock: data.stock,
            newImages: [],
            oldImages: data.image || [],
          }}
          validationSchema={productSchema}
          onSubmit={async (val) => {
            const formData = new FormData();

            formData.append("title", val.title);
            formData.append("detail", val.detail);
            formData.append("price", val.price);
            formData.append("category", val.category);
            formData.append("stock", val.stock);


            val.newImages.forEach((img) => {
              formData.append("image", img);
            });


            formData.append("oldImages", JSON.stringify(val.oldImages));

            try {
              await updateProduct({
                id,
                token: user.token,
                body: formData,
              }).unwrap();

              toast.success("Updated successfully");
              nav(-1);
            } catch (err) {
              toast.error(err.data?.message || "Error");
            }
          }}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">

              <Input name="title" value={values.title} onChange={handleChange} />
              <Textarea name="detail" value={values.detail} onChange={handleChange} />
              <Input type="number" name="price" value={values.price} onChange={handleChange} />
              <Input type="number" name="stock" value={values.stock} onChange={handleChange} />


              <Select
                value={values.category}
                onValueChange={(val) => setFieldValue("category", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bed">bed</SelectItem>
                  <SelectItem value="sofa">sofa</SelectItem>
                  <SelectItem value="table">table</SelectItem>
                  <SelectItem value="wardrobe">wardrobe</SelectItem>
                  <SelectItem value="chair">chair</SelectItem>
                  <SelectItem value="desk">desk</SelectItem>
                </SelectContent>
              </Select>


              <Input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);

                  setFieldValue("newImages", [
                    ...values.newImages,
                    ...files,
                  ]);
                }}
              />

              <div>
                <p className="font-semibold">Images</p>
                <div className="flex gap-2 flex-wrap">

                  {values.oldImages.map((img, index) => (
                    <div key={`old-${index}`} className="relative">
                      <img src={img.url} className="w-24 h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("oldImages", values.oldImages.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full"
                      >✕</button>
                    </div>
                  ))}

                  {values.newImages.map((img, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img src={URL.createObjectURL(img)} className="w-24 h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("newImages", values.newImages.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full"
                      >✕</button>
                    </div>
                  ))}

                </div>
              </div>

              <Button disabled={isLoading} type="submit">
                {isLoading ? <Spinner /> : "Update"}
              </Button>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}