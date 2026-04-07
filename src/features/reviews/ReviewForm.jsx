import { Formik } from "formik";
import { Textarea } from "../../components/ui/textarea.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import * as Yup from "yup";
import { useAddReviewMutation } from "./reviewApi.js";
import { Spinner } from "../../components/ui/spinner.jsx";
import { toast } from "sonner";
import { useSelector } from "react-redux";


const reviewSchema = Yup.object({
  rating: Yup.number().required("Rating is required"),
  comment: Yup.string().required("Comment is required"),
});



export default function ReviewForm({ id }) {
  const [addReview, { isLoading }] = useAddReviewMutation();
  const { user } = useSelector((state) => state.userSlice);
  return (
    <div className="mt-5">


      <h3 className="mb-5">Add a review</h3>

      <Formik
        initialValues={{
          rating: '',
          comment: ''
        }}

        onSubmit={async (val, { resetForm }) => {
          try {
            await addReview({
              id,
              token: user.token,
              body: val
            }).unwrap();
            resetForm();
            toast.success('Review added successfully');
          } catch (err) {
            toast.error(err.data.message);
          }


        }}

        validationSchema={reviewSchema}

      >

        {({ setFieldValue, handleSubmit, values, handleChange, errors, touched }) => (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 max-w-xl">

            <Select
              value={values.rating}
              name="rating"
              onValueChange={(e) => setFieldValue("rating", e)}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a something" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="1">VeryBad</SelectItem>
                  <SelectItem value="2">Bad</SelectItem>
                  <SelectItem value="3">Good</SelectItem>
                  <SelectItem value="4">Very Good</SelectItem>
                  <SelectItem value="5">Excellent</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.rating && touched.rating && <p className="text-red-500">{errors.rating}</p>}

            <Textarea
              value={values.comment}
              onChange={handleChange}
              name="comment"
              placeholder="Write your review" />
            {errors.comment && touched.comment && <p className="text-red-500">{errors.comment}</p>}
            <Button
              disabled={isLoading}
              type="submit">

              {isLoading ? <Spinner /> : "Submit"}
            </Button>

          </form>
        )}

      </Formik>




    </div>
  )
}
