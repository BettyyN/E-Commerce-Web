import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Tag,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import CategoryMenu from "./CategoryMenu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/shared/ui/badge";
import { useAuthStore } from "@/store/auth.store";
import { LoginModal, SignupModal } from "./AuthModal";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategories?: string[];
  onCategorySelect?: (category: string) => void;
  hasActiveFilters?: boolean;
}

const Header = ({
  onSearch,
  searchQuery: propSearchQuery,
  onSearchChange,
  selectedCategories = [],
  onCategorySelect,
  hasActiveFilters = false,
}: HeaderProps) => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const searchQuery =
    propSearchQuery !== undefined ? propSearchQuery : internalSearchQuery;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleSearchChange = (value: string) => {
    if (onSearchChange) onSearchChange(value);
    else setInternalSearchQuery(value);
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const openLogin = () => setLoginOpen(true);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const showCategoryMenu = Boolean(onCategorySelect);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brown-200 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-20 items-center justify-between gap-2">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer shrink-0"
            onClick={() => navigate("/")}
          >
            <img
              src="/horizontalLogo.png"
              alt="STOCK UP"
              className="h-12 w-auto"
            />
          </div>

          {/* Search + Categories — Desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center mx-8 min-w-0">
            {/* Browse Categories button beside the search bar */}
            {showCategoryMenu && (
              <div className="shrink-0 mr-3 relative z-20">
                <CategoryMenu
                  onCategorySelect={onCategorySelect!}
                  selectedCategories={selectedCategories}
                />
              </div>
            )}
            <form
              onSubmit={handleSearch}
              className="relative flex-1 max-w-xl min-w-0"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full h-12 min-w-0 rounded-full border border-gray-300 bg-brown-50/50 px-3 py-1 pl-12 pr-10 text-base outline-none shadow-xl transition-[color,box-shadow] placeholder:text-muted-foreground focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-200 md:text-sm"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {hasActiveFilters && (
                <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-600 h-4 w-4" />
              )}
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated && user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/customer/dashboard")}
                  className="hidden sm:inline-flex justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
                {/* Cart */}
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-brown-900 hover:from-yellow-600 hover:to-yellow-700 rounded-full shadow-sm relative"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>

                {/* Avatar dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="" alt={user.userName} />
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-brown-900 font-semibold">
                          {getInitials(user.userName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2" align="end">
                    <div className="flex flex-col gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/customer/profile")}
                        className="justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Button>
                      <div className="h-px bg-brown-200" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="justify-start gap-2 font-normal text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <>
                {/* Guest: Cart (still visible to browse) */}
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-brown-900 hover:from-yellow-600 hover:to-yellow-700 rounded-full shadow-sm relative"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>

                {/* Login / Sign up */}
                <Button
                  variant="outline"
                  // className="border-brown-300 text-brown-700 hover:bg-yellow-50 rounded-full px-5"
                  className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 rounded-full px-5"
                  onClick={openLogin}
                >
                  Login
                </Button>
              </>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-brown-700 hover:text-brown-900 hover:bg-brown-50 rounded-full h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Selected category chips (desktop) */}
        {showCategoryMenu && selectedCategories.length > 0 && (
          <div className="hidden lg:flex flex-wrap items-center gap-2 py-2 border-t border-brown-100">
            <span className="text-xs text-brown-500 font-medium">
              Filtering by:
            </span>
            {selectedCategories.map((category) => (
              <div
                key={category}
                className="bg-yellow-100 text-brown-800 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
              >
                <span>{category}</span>
                <button
                  onClick={() => onCategorySelect!(category)}
                  className="h-4 w-4 rounded-full flex items-center justify-center text-brown-600 hover:text-brown-900 hover:bg-brown-200 transition-colors"
                  aria-label={`Remove ${category} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => onCategorySelect!("")}
              className="text-xs text-brown-500 hover:text-brown-800 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-brown-100 space-y-3">
            {isAuthenticated && user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/customer/dashboard")}
                className="sm:hidden w-full justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
            )}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-4 rounded-full border-brown-200 bg-brown-50/50"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </form>
            {showCategoryMenu && (
              <CategoryMenu
                onCategorySelect={onCategorySelect!}
                selectedCategories={selectedCategories}
              />
            )}
          </div>
        )}
      </div>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => setSignupOpen(true)}
      />
      <SignupModal
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </header>
  );
};

export default Header;
