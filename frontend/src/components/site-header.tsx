import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User, Heart, ShoppingCart } from "lucide-react";
import { NAV, SITE } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import logo from "../assets/logo.png";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string, role?: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCounts = () => {
      setCartCount(JSON.parse(localStorage.getItem('cart') || '[]').length);
      setWishlistCount(JSON.parse(localStorage.getItem('wishlist') || '[]').length);
    };
    updateCounts();
    window.addEventListener('cart-updated', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);
    return () => {
      window.removeEventListener('cart-updated', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
    };
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    checkUser();
    window.addEventListener("user-changed", checkUser);
    return () => window.removeEventListener("user-changed", checkUser);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-elevated border-b border-border/60"
          : "bg-transparent",
      )}
    >
      <div className="flex w-full items-center justify-between px-4 py-5 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SL SHOPEE Logo" className="h-9 w-auto object-contain" />
          <span className="font-display text-2xl font-bold tracking-tight uppercase">
            {SITE.name}
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand"
                activeProps={{ className: "text-brand" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 relative">
            <Link to="/wishlist" className="relative flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-white text-muted-foreground border border-border/60 hover:text-brand hover:border-brand/40 transition-colors">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-sm border border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-white text-muted-foreground border border-border/60 hover:text-brand hover:border-brand/40 transition-colors">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-sm border border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow transition-transform hover:scale-105"
              >
                <User className="h-4 w-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-40 overflow-hidden rounded-xl border border-border bg-white shadow-elevated text-sm z-50">
                  {user ? (
                    <>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 font-medium hover:bg-muted transition-colors text-brand border-b border-border">Admin Config</Link>
                      )}
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 font-medium hover:bg-muted transition-colors text-foreground">My Profile</Link>
                      <button onClick={() => {
                        localStorage.removeItem("user");
                        window.dispatchEvent(new Event("user-changed"));
                        setDropdownOpen(false);
                        navigate({ to: "/Login" });
                      }} className="block w-full text-left px-4 py-2.5 font-medium hover:bg-muted transition-colors border-t border-border text-foreground">Log out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/Login" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 font-medium hover:bg-muted transition-colors text-foreground">Sign In</Link>
                      <Link to="/Signup" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 font-medium hover:bg-muted transition-colors border-t border-border text-foreground">Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="grid h-10 w-10 place-items-center rounded-md md:hidden ml-2"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex w-full flex-col px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-foreground/80"
                activeProps={{ className: "text-brand" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/wishlist" onClick={() => setOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted transition-colors border-t border-border mt-2">
              Wishlist
              {wishlistCount > 0 && <span className="bg-brand text-white font-bold text-[10px] rounded-full px-2 py-0.5">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted transition-colors border-t border-border">
              Shopping Cart
              {cartCount > 0 && <span className="bg-brand text-white font-bold text-[10px] rounded-full px-2 py-0.5">{cartCount}</span>}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}