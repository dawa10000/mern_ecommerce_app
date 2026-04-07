import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik } from "formik"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import * as Yup from "yup"
import { useLoginUserMutation } from "./authApi.js"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setUser } from "../user/userSlice.js"
import { Spinner } from "../../components/ui/spinner.jsx"

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(8).max(50).required("Password is required"),
})

export default function Login() {
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const nav = useNavigate();
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show)
  };

  return (
    <div className="flex justify-center items-center p-9">
      <Card className="w-full max-w-sm  ">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button onClick={() => nav('/register')} variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginSchema}
            onSubmit={async (val) => {
              try {
                const response = await loginUser(val).unwrap();
                toast.success('Login Successfully');

                dispatch(setUser(response));
                nav(-1);


              } catch (err) {
                console.log(err);

              }
            }}
          >
            {({ handleChange, handleSubmit, values, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
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
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={show ? 'text' : 'password'}
                        placeholder="********"
                        onChange={handleChange}
                        value={values.password}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleShow}
                        className="absolute inset-y-0 right-0"
                      >
                        {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </div>

                <Button disabled={isLoading} type="submit" className="w-full mt-6">
                  {isLoading ? <Spinner /> : 'Login'}
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}