import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useCreateCheckoutMutation } from "./checkoutApi.js";
import { setOrderSuccess } from "./checkoutSlice.js";
import { clearCart } from "../carts/cartSlice.js";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { baseUrl } from "../../app/mainApi.js";

export const STORAGE_KEY = "checkout_billing_info";

const redirectToEsewa = async (orderId, total) => {
  const res = await fetch(`${baseUrl}/checkout/esewa-signature`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ total, orderId }),
  });

  const { signature, productCode, amount } = await res.json();

  const form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

  const fields = {
    amount: amount,
    tax_amount: "0",
    total_amount: amount,
    transaction_uuid: orderId,
    product_code: productCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: `${baseUrl}/checkout/verify-esewa`,
    failure_url: `${baseUrl}/checkout/verify-esewa`,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", key);
    input.setAttribute("value", String(value));
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

function CheckoutHero() {
  return (
    <div className="relative bg-gray-200 h-40 sm:h-56 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 opacity-80" />
      <div className="relative z-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">Checkout</h1>
        <p className="text-sm text-gray-600 mt-1">
          <span className="hover:text-yellow-700 cursor-pointer">Home</span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-800 font-medium">Checkout</span>
        </p>
      </div>
    </div>
  );
}

const provinces = [
  "Western Province", "Central Province", "Southern Province",
  "Northern Province", "Eastern Province", "North Western Province",
  "North Central Province", "Uva Province", "Sabaragamuwa Province",
];
const countries = ["Sri Lanka", "India", "Maldives", "Nepal", "Bangladesh"];

const saveBillingInfo = (values) => {
  try {
    const { paymentMethod, ...billingOnly } = values;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(billingOnly));
  } catch { }
};

const loadBillingInfo = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

const defaultValues = {
  firstName: "", lastName: "", companyName: "",
  country: "Sri Lanka", street: "", city: "",
  province: "Western Province", zip: "",
  phone: "", email: "", additionalInfo: "",
  paymentMethod: "eSewa",
};

const checkoutSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  companyName: Yup.string(),
  country: Yup.string().required("Country is required"),
  street: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  province: Yup.string().required("Province is required"),
  zip: Yup.string().required("ZIP code is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  additionalInfo: Yup.string(),
  paymentMethod: Yup.string().oneOf(["eSewa", "Cash On Delivery"]).required(),
});

function FormField({ label, name, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm mb-1 font-medium text-gray-700">{label}</label>
      <Field name={name} type={type} placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
      <ErrorMessage name={name} component="p" className="text-red-500 text-xs mt-1" />
    </div>
  );
}

function AutoSave() {
  const { values } = useFormikContext();
  useEffect(() => { saveBillingInfo(values); }, [values]);
  return null;
}

export default function Checkout() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { cart } = useSelector((state) => state.cartSlice);
  const { user } = useSelector((state) => state.userSlice);
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedInfoCleared, setSavedInfoCleared] = useState(false);

  const savedInfo = !savedInfoCleared ? loadBillingInfo() : null;
  const initialValues = savedInfo ? { ...defaultValues, ...savedInfo } : defaultValues;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  const formatPrice = (amount) =>
    `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const handleSubmit = async (values) => {
    if (cart.length === 0) { toast.error("Your cart is empty"); return; }

    const products = cart.map((item) => ({ product: item.id, quantity: item.quantity }));

    const body = {
      firstName: values.firstName, lastName: values.lastName,
      companyName: values.companyName, country: values.country,
      street: values.street, city: values.city, province: values.province,
      zip: values.zip, phone: values.phone, email: values.email,
      additionalInfo: values.additionalInfo, paymentMethod: values.paymentMethod,
      products, subtotal, total,
    };

    try {
      const res = await createCheckout({ body, token: user?.token }).unwrap();
      setDialogOpen(false);

      if (values.paymentMethod === "eSewa") {
        await redirectToEsewa(res.order._id, total);
      } else {
        dispatch(setOrderSuccess({ orderId: res.order._id, orderDetails: res.order }));
        localStorage.removeItem(STORAGE_KEY);
        dispatch(clearCart());
        if (res.mailError) {
          toast.warning(`Order placed but email failed: ${res.mailError}`);
        } else {
          toast.success("Order placed successfully!");
        }
        nav("/shop");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <div>
      <CheckoutHero />
      <div className="min-h-screen bg-white font-sans text-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold tracking-tight font-serif">Billing details</h1>
            {savedInfo && (
              <button type="button"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setSavedInfoCleared(true);
                }}
                className="text-xs text-gray-400 underline hover:text-red-500 transition-colors">
                Clear saved info
              </button>
            )}
          </div>

          {savedInfo && (
            <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
              <span>✓</span>
              <span>Your billing details have been filled from your last session.</span>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, validateForm, setTouched }) => (
              <Form>
                <AutoSave />
                <div className="flex flex-col lg:flex-row gap-16">

                  {/* Left: Billing Fields */}
                  <div className="flex-1 space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1"><FormField label="First Name" name="firstName" /></div>
                      <div className="flex-1"><FormField label="Last Name" name="lastName" /></div>
                    </div>
                    <FormField label="Company Name (Optional)" name="companyName" />

                    <div>
                      <label className="block text-sm mb-1 font-medium text-gray-700">Country / Region</label>
                      <div className="relative">
                        <Field as="select" name="country"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-600">
                          {countries.map((c) => <option key={c}>{c}</option>)}
                        </Field>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                      </div>
                    </div>

                    <FormField label="Street address" name="street" />
                    <FormField label="Town / City" name="city" />

                    <div>
                      <label className="block text-sm mb-1 font-medium text-gray-700">Province</label>
                      <div className="relative">
                        <Field as="select" name="province"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-600">
                          {provinces.map((p) => <option key={p}>{p}</option>)}
                        </Field>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                      </div>
                    </div>

                    <FormField label="ZIP code" name="zip" />
                    <FormField label="Phone" name="phone" type="tel" />
                    <FormField label="Email address" name="email" type="email" />

                    <div>
                      <Field as="textarea" name="additionalInfo" placeholder="Additional information" rows={3}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400 resize-none"
                      />
                    </div>
                  </div>

                  {/* Right: Order Summary + Payment */}
                  <div className="w-full lg:w-80 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-semibold mb-3 border-b pb-2">
                        <span>Product</span><span>Subtotal</span>
                      </div>
                      {cart.length === 0 ? (
                        <p className="text-sm text-gray-400">Your cart is empty</p>
                      ) : cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-3">
                          <span>{item.title} <span className="text-gray-400 font-medium">× {item.quantity}</span></span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm border-t pt-3 mb-2">
                        <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t pt-3">
                        <span>Total</span>
                        <span className="text-yellow-600 text-base font-bold">{formatPrice(total)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <p className="text-sm font-semibold text-gray-800">Payment Method</p>

                      {/* eSewa Radio — using Formik Field */}
                      <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${values.paymentMethod === "eSewa" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <Field type="radio" name="paymentMethod" value="eSewa" className="accent-green-600" />
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-black">e</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">eSewa</p>
                            <p className="text-xs text-gray-400">Pay via eSewa digital wallet</p>
                          </div>
                        </div>
                      </label>

                      {/* Cash On Delivery Radio — using Formik Field */}
                      <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${values.paymentMethod === "Cash On Delivery" ? "border-gray-800 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <Field type="radio" name="paymentMethod" value="Cash On Delivery" className="accent-gray-700" />
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs">💵</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Cash On Delivery</p>
                            <p className="text-xs text-gray-400">Pay when you receive</p>
                          </div>
                        </div>
                      </label>

                      {values.paymentMethod === "eSewa" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                          <p className="font-semibold mb-1">eSewa Test Credentials</p>
                          <p>eSewa ID: <span className="font-mono">9806800001</span></p>
                          <p>Password: <span className="font-mono">Nepal@123</span></p>
                          <p>MPIN: <span className="font-mono">1122</span></p>
                          <p>Token: <span className="font-mono">123456</span></p>
                        </div>
                      )}

                      <ErrorMessage name="paymentMethod" component="p" className="text-red-500 text-xs" />

                      <p className="text-xs text-gray-500 leading-relaxed pt-1">
                        Your personal data will be used to support your experience throughout this website.{" "}
                        <strong className="text-gray-800">privacy policy.</strong>
                      </p>

                      <button
                        type="button"
                        disabled={isLoading || cart.length === 0}
                        onClick={async () => {
                          const fields = Object.keys(defaultValues);
                          const touched = fields.reduce((acc, key) => ({ ...acc, [key]: true }), {});
                          setTouched(touched);
                          const errors = await validateForm();
                          if (Object.keys(errors).length === 0) {
                            setDialogOpen(true);
                          } else {
                            toast.error("Please fill in all required fields");
                          }
                        }}
                        className="w-full border border-gray-800 text-gray-800 text-sm py-3 rounded hover:bg-gray-800 hover:text-white transition-colors duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Processing..." : values.paymentMethod === "eSewa" ? "Pay with eSewa →" : "Place order"}
                      </button>

                      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-serif text-xl">Confirm Your Order</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                              <div className="space-y-3 text-sm text-gray-600 mt-2">
                                <div className="border rounded-lg p-3 space-y-2 bg-gray-50">
                                  {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                      <span className="line-clamp-1 flex-1 mr-2 text-gray-700">
                                        {item.title}<span className="text-gray-400"> × {item.quantity}</span>
                                      </span>
                                      <span className="font-medium text-gray-800 whitespace-nowrap">
                                        {formatPrice(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div className="space-y-1 border-t pt-2">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-gray-900 text-base">
                                    <span>Total</span>
                                    <span className="text-yellow-600">{formatPrice(total)}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
                                  <span>Payment</span>
                                  <span className={`font-medium ${values.paymentMethod === "eSewa" ? "text-green-600" : "text-gray-700"}`}>
                                    {values.paymentMethod}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Shipping To</span>
                                  <span className="font-medium text-gray-700 text-right max-w-[60%]">
                                    {values.street}, {values.city}, {values.province}
                                  </span>
                                </div>
                                {values.paymentMethod === "eSewa" && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-700">
                                    You will be redirected to eSewa to complete payment.
                                  </div>
                                )}
                                <p className="text-xs text-gray-400 pt-1">By confirming, you agree to our terms.</p>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-sm border-gray-300">Go Back</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleSubmit(values)}
                              disabled={isLoading}
                              className={`text-sm text-white ${values.paymentMethod === "eSewa" ? "bg-green-600 hover:bg-green-700" : "bg-gray-900 hover:bg-gray-700"}`}
                            >
                              {isLoading ? "Processing..." : values.paymentMethod === "eSewa" ? "Pay with eSewa" : "✓ Confirm Order"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}