import {
  UserIcon,
  BellIcon,
  LogOutIcon,
  LayoutDashboard,
  ShoppingBagIcon,
  ListOrdered,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { useDispatch } from "react-redux";
import { removeUser } from "../features/user/userSlice.js";
import { useNavigate } from "react-router";
import { useGetUserQuery } from "../features/user/userApi.js";



const userlistItems = [
  { icon: UserIcon, property: "Profile" },
  { icon: ShoppingBagIcon, property: "Cart" },
  { icon: ListOrdered, property: "My Orders" },
  { icon: LogOutIcon, property: "Sign Out" },
];

const adminlistItems = [
  { icon: UserIcon, property: "Profile" },
  { icon: LayoutDashboard, property: "Admin Dashboard" },
  { icon: ListOrdered, property: "All Orders" },
  { icon: LogOutIcon, property: "Sign Out" },
];

const DropdownMenuButton = ({ user }) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { isLoading, error, data } = useGetUserQuery(user?.token, {
    skip: !user?.token,
  });

  if (!user) {
    return (
      <Button onClick={() => nav("/login")}>
        Login
      </Button>
    );
  }

  const listItem =
    user?.role === "admin" ? adminlistItems : userlistItems;


  if (isLoading) {
    return (
      <Button
        variant="secondary"
        size="icon"
        className="overflow-hidden rounded-full"
      >

      </Button>
    );
  }


  if (error) {
    return (
      <p className="text-red-500">
        {error?.data?.message || "Something went wrong"}
      </p>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <img
            src={data?.image ? data.image : "/default-avatar.png"}
            alt="user"
            className="w-full h-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          {listItem.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                switch (item.property) {
                  case "Sign Out":
                    dispatch(removeUser());
                    localStorage.removeItem("user");
                    nav("/login");
                    break;

                  case "Profile":
                    nav("/profile");
                    break;

                  case "Admin Dashboard":
                    nav("/admin-dashboard");
                    break;

                  case "Cart":
                    nav("/order-place");
                    break;

                  case "My Orders":
                    nav("/my-orders");
                    break;

                  case "All Orders":
                    nav("/all-orders");
                    break;

                  case "Notifications":
                    nav("/notifications");
                    break;

                  default:
                    break;
                }
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <item.icon size={16} />
              <span>{item.property}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuButton;