import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Shield,
  User,
  LogOut,
  PackageCheck,
  Truck,
  Phone,
  Home as HomeIcon,
  Layers
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { user, isAdmin, openAuth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Search input state
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  // Keep search input synced with URL
  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [activeParentCategory, setActiveParentCategory] = useState(null);

  const dropdownRef = useRef(null);

  // Close desktop category flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
        setActiveParentCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileCategoryOpen(false);
  }, [location.pathname, location.search]);

  const handleSelectProduct = (productSlug) => {
    setIsCategoryOpen(false);
    setActiveParentCategory(null);
    setIsMobileMenuOpen(false);
    navigate(`/?category=${productSlug}`);
  };

  const handleGoHome = () => {
    setIsCategoryOpen(false);
    setActiveParentCategory(null);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  // Search handlers
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    const newParams = new URLSearchParams(location.search);
    if (val.trim()) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    navigate(`/?${newParams.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    const newParams = new URLSearchParams(location.search);
    newParams.delete('search');
    navigate(`/?${newParams.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchValue.trim()) {
      newParams.set('search', searchValue.trim());
    }
    navigate(`/?${newParams.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all w-full shadow-2xs">
      
      {/* ========================================================
          DESKTOP & TABLET VIEW (md and above):
          Left Column: Brand Logo (Spans full height, NO dividing vertical line)
          Right Column: 2 Symmetrical Rows (54px each, NO dividing horizontal line, NO box borders around items)
      ======================================================== */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch h-[108px]">
          
          {/* Left Column: Brand Logo (Clean, borderless, spanning full height) */}
          <div className="flex items-center pr-6 mr-4 shrink-0">
            <Link to="/" onClick={handleGoHome} className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-[#1c2d4a] flex items-center justify-center text-white shadow-md shadow-[#1c2d4a]/25 group-hover:scale-105 transition shrink-0">
                <span className="font-serif font-black text-2xl tracking-tighter text-white">A</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-black text-xl text-slate-900 tracking-tight">
                    APPZYS<span className="text-[#1c2d4a]">®</span>
                  </span>
                  <span className="text-[9px] bg-[#eef2f8] text-[#1c2d4a] font-extrabold px-1.5 py-0.5 rounded border border-[#d2ddec]">
                    SMART STORAGE
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium -mt-0.5">
                  Saree & Jewellery Organizers
                </p>
              </div>
            </Link>
          </div>

          {/* Right Column: Two Symmetrical Rows (54px each, Clean & Borderless) */}
          <div className="flex-1 flex flex-col justify-between h-full min-w-0">
            
            {/* ========================================================
                ROW 1: EXACT 54px HEIGHT (Centered: Search Bar + Action Buttons)
            ======================================================== */}
            <div className="h-[54px] flex items-center justify-between gap-4">
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="What are you searching for?"
                  className="w-full h-[38px] pl-10 pr-9 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1c2d4a] focus:outline-hidden text-xs text-slate-800 transition placeholder:text-slate-400 shadow-2xs"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Action Buttons (Hover highlights only) */}
              <div className="flex items-center gap-1.5 shrink-0">
                
                {/* Admin Link (if authorized) */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="h-[38px] px-3 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* My Orders Button */}
                <Link
                  to="/my-orders"
                  className="h-[38px] px-3 text-slate-700 hover:text-[#1c2d4a] hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>

                {/* Customer Login / User Profile */}
                {user ? (
                  <div className="relative group">
                    <button className="h-[38px] px-3 text-slate-700 hover:text-[#1c2d4a] hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition text-xs font-bold cursor-pointer">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[70px] truncate hidden lg:inline">{user.name}</span>
                    </button>
                    <div className="absolute right-0 top-full pt-1 hidden group-hover:block w-48 shadow-lg rounded-2xl bg-white border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/my-orders" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                        Track Orders
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link to="/admin" className="block px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold">
                          Manage Store (Admin)
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openAuth('login', 'CUSTOMER')}
                    className="h-[38px] px-3 text-slate-700 hover:text-[#1c2d4a] hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                )}

                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="h-[38px] px-3.5 bg-[#1c2d4a] hover:bg-[#15233a] text-white rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer active:scale-95"
                  aria-label="View Cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Cart</span>
                  {totalItemCount > 0 && (
                    <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full min-w-4.5 h-4.5 flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </button>
              </div>

            </div>

            {/* ========================================================
                ROW 2: EXACT 54px HEIGHT (Hover pill highlight, Brand Navy text on Click/Active, NO solid dark box)
            ======================================================== */}
            <div className="h-[54px] flex items-center gap-1.5 sm:gap-2 relative">
              
              {/* Item 1: Home Link */}
              <Link
                to="/"
                onClick={handleGoHome}
                className={`h-[38px] px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer hover:bg-slate-100/80 ${
                  location.pathname === '/' && !location.search
                    ? 'text-[#1c2d4a]'
                    : 'text-slate-700 hover:text-[#1c2d4a]'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {/* Item 2: Shop by Category Dropdown (Opens on BOTH Hover & Click) */}
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => {
                  setIsCategoryOpen(false);
                  setActiveParentCategory(null);
                }}
              >
                <button
                  onClick={() => setIsCategoryOpen((prev) => !prev)}
                  className={`h-[38px] px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer hover:bg-slate-100/80 ${
                    isCategoryOpen
                      ? 'text-[#1c2d4a]'
                      : 'text-slate-700 hover:text-[#1c2d4a]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Shop by Category</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Wrapper (pt-1 bridges any gap between button and card) */}
                {isCategoryOpen && (
                  <div className="absolute left-0 top-full pt-1 z-50">
                    <div className="w-56 bg-white shadow-2xl rounded-2xl border border-slate-200 py-3 animate-in fade-in">
                      <div className="px-4 pb-2 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Categories
                      </div>
                      <div className="py-1">
                        {/* All Products (Hover closes the wardrobe sub-menu) */}
                        <button
                          onClick={handleGoHome}
                          onMouseEnter={() => setActiveParentCategory(null)}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-[#1c2d4a] hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                        >
                          <span>All Products</span>
                        </button>

                        {/* Wardrobe Organizers Row (Hover or Click opens sub-menu STRAIGHT to this button) */}
                        <div
                          className="relative"
                          onMouseEnter={() => setActiveParentCategory('wardrobe')}
                        >
                          <button
                            onClick={() => setActiveParentCategory((prev) => (prev === 'wardrobe' ? null : 'wardrobe'))}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                              activeParentCategory === 'wardrobe'
                                ? 'text-[#1c2d4a] bg-slate-50'
                                : 'text-slate-700 hover:text-[#1c2d4a] hover:bg-slate-50'
                            }`}
                          >
                            <span>Wardrobe Organizers</span>
                            <ChevronRight className={`w-3.5 h-3.5 ${activeParentCategory === 'wardrobe' ? 'text-[#1c2d4a]' : 'text-slate-400'}`} />
                          </button>

                          {/* Sub-menu: Opens straight aligned horizontally with Wardrobe Organizers option */}
                          {activeParentCategory === 'wardrobe' && (
                            <div className="absolute left-full top-0 pl-1.5 z-50">
                              <div className="w-56 bg-white shadow-2xl rounded-2xl border border-slate-200 py-3 animate-in fade-in">
                                <div className="px-4 pb-2 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                  Wardrobe Organizers
                                </div>
                                <div className="py-1">
                                  <button
                                    onClick={() => handleSelectProduct('saree-organiser')}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-[#1c2d4a] hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    Saree Organizer
                                  </button>
                                  <button
                                    onClick={() => handleSelectProduct('jewel-organiser')}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-[#1c2d4a] hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    Jewellery Organizer
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Item 3: Track Your Order */}
              <Link
                to="/track-order"
                className={`h-[38px] px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer hover:bg-slate-100/80 ${
                  location.pathname === '/track-order'
                    ? 'text-[#1c2d4a]'
                    : 'text-slate-700 hover:text-[#1c2d4a]'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Track Your Order</span>
              </Link>

              {/* Item 4: Contact Us */}
              <Link
                to="/contact"
                className={`h-[38px] px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer hover:bg-slate-100/80 ${
                  location.pathname === '/contact'
                    ? 'text-[#1c2d4a]'
                    : 'text-slate-700 hover:text-[#1c2d4a]'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>

            </div>

          </div>

        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW (Screens < md): Compact Top Bar + Mobile Search Row
      ======================================================== */}
      <div className="md:hidden px-3 py-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Mobile Logo */}
          <Link to="/" onClick={handleGoHome} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1c2d4a] flex items-center justify-center text-white font-serif font-black text-base shadow-xs">
              A
            </div>
            <div>
              <span className="font-serif font-bold text-base text-slate-900 tracking-tight">
                APPZYS<span className="text-[#1c2d4a]">®</span>
              </span>
              <span className="text-[8px] bg-[#eef2f8] text-[#1c2d4a] font-bold px-1.5 py-0.2 rounded ml-1 border border-[#d2ddec]">
                STORAGE
              </span>
            </div>
          </Link>

          {/* Right: Cart */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-[#1c2d4a] text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs active:scale-95 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
              {totalItemCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full min-w-4.5 h-4.5 flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="What are you searching for?"
            className="w-full pl-8 pr-7 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2.5 text-slate-400 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

    </header>
  );
};

export default Navbar;
