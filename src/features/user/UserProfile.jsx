import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik } from "formik"
import * as Yup from "yup"
import { Spinner } from "../../components/ui/spinner.jsx"
import { toast } from "sonner"
import { Textarea } from "../../components/ui/textarea.jsx"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { useGetUserQuery, useUpdateUserMutation } from "./userApi.js"

const profileSchema = Yup.object({
  username: Yup.string().min(4).max(50).required("Username is required"),
  email: Yup.string().email().required("Email is required"),
  bio: Yup.string().min(10).max(200).required("Bio is required"),
  image: Yup.mixed()
    .test('fileType', 'Unsupported File Format', (value) => {
      if (!value) return true; // ← optional, skip if no file selected
      return ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(value.type);
    })
    .test('fileSize', 'File is too large (max 5MB)', (value) => {
      if (!value) return true; // ← optional, skip if no file selected
      return value.size <= 5 * 1024 * 1024;
    }),
});

export default function UserProfile() {
  const nav = useNavigate();
  const { user } = useSelector((state) => state.userSlice);

  const { isLoading, data, error } = useGetUserQuery(user.token);
  const [updateProfile, { isLoading: isLoad }] = useUpdateUserMutation();

  if (isLoading) return (
    <div className="flex gap-4 items-center">
      <h3>Loading...</h3>
      <Spinner />
    </div>
  );

  if (error) return <p className="text-red-500">{error.data?.message}</p>;

  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Update your account</CardTitle>
          <CardDescription>
            Enter your details below to update your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              username: data.username,
              email: data.email,
              bio: data.bio,
              image: null,          // ← null instead of ''
              imagePreview: data.image     // ← full Cloudinary URL
            }}
            validationSchema={profileSchema}
            onSubmit={async (val) => {
              const formData = new FormData();
              formData.append('username', val.username);
              formData.append('email', val.email);
              formData.append('bio', val.bio);

              if (val.image) {
                formData.append('image', val.image); // ← only append if new image selected
              }

              try {
                await updateProfile({
                  body: formData,
                  token: user.token,
                }).unwrap();
                toast.success('Profile updated successfully');
                nav(-1);
              } catch (err) {
                toast.error(err?.data?.message || "Something went wrong");
              }
            }}
          >
            {({ handleChange, handleSubmit, values, touched, errors, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">

                  {/* Username */}
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="John Doe"
                      onChange={handleChange}
                      value={values.username}
                    />
                    {touched.username && errors.username && (
                      <p className="text-red-500 text-xs">{errors.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={handleChange}
                      value={values.email}
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Something about yourself"
                      onChange={handleChange}
                      value={values.bio}
                    />
                    {touched.bio && errors.bio && (
                      <p className="text-red-500 text-xs">{errors.bio}</p>
                    )}
                  </div>

                  {/* Image */}
                  <div className="grid gap-2">
                    <Label htmlFor="image">Profile Image</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setFieldValue('image', file);
                        setFieldValue('imagePreview', URL.createObjectURL(file));
                      }}
                    />
                    {touched.image && errors.image && (
                      <p className="text-red-500 text-xs">{errors.image}</p>
                    )}

                    {/* Preview — works for both blob URL and Cloudinary URL */}
                    {values.imagePreview && !errors.image && (
                      <img
                        src={values.imagePreview}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border mt-2"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/96x96?text=No+Image";
                        }}
                      />
                    )}
                  </div>

                </div>

                <Button
                  type="submit"
                  disabled={isLoad}
                  className="w-full mt-6"
                >
                  {isLoad ? <Spinner /> : 'Update'}
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}