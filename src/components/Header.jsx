import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import DropdownMenuButton from "./DropDownMenuButton.jsx";
import SearchForm from "../features/search/SearchForm.jsx";
import { Button } from "./ui/button.jsx";


const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Header() {
  const { user } = useSelector((state) => state.userSlice);
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = useNavigate();
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="text-xl font-bold tracking-widest text-gray-800 font-serif">Furniro</div>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 text-sm text-gray-700 font-medium">
            <li onClick={() => nav('/')} className="hover:text-yellow-700 cursor-pointer transition-colors">Home</li>
            <li onClick={() => nav('/shop')} className="hover:text-yellow-700 cursor-pointer transition-colors">Shop</li>
            <li className="hover:text-yellow-700 cursor-pointer transition-colors">About</li>


          </ul>


          <div className="flex gap-5">
            <div>
              <SearchForm />
            </div>
            {user ? <DropdownMenuButton user={user} /> : <div className="flex gap-3">
              <NavLink to="/login">
                <Button variant="text">Login</Button>
              </NavLink>

              <NavLink to={'/register'}>
                <Button variant="outline" className="text-green-600">Sign Up</Button>
              </NavLink>



            </div>}
          </div>


          {/* Mobile hamburger */}
          <Button className="md:hidden bg-white text-gray-700 hover:bg-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
        </div>




      </div>





      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden text-white border-t px-6 py-4 flex flex-col gap-4">

          <ul className="flex flex-col gap-5 text-gray-700 pt-2 border-t">
            <li onClick={() => nav('/')} className="hover:text-yellow-700 cursor-pointer transition-colors">Home</li>
            <li onClick={() => nav('/shop')} className="hover:text-yellow-700 cursor-pointer transition-colors">Shop</li>
            <li className="hover:text-yellow-700 cursor-pointer transition-colors">About</li>


          </ul>


        </div>
      )}
    </nav>
  );
}