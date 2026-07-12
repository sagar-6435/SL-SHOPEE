import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users, Image,
  BarChart3, MessageCircle, Bell, LogOut, Menu, X, ChevronRight,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/campaigns", label: "WhatsApp Campaigns", icon: MessageCircle },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const routerState = useRouterState();
  const navigate = useNavigate();
  const path = routerState.location.pathname;

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  useEffect(() => {
    let auth = false;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      auth = user?.role === "admin";
    } catch { }

    if (auth) {
      setIsAuthorized(true);
    } else {
      navigate({ to: "/Login", replace: true });
    }
  }, [navigate]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-[oklch(0.97_0.005_260)]" />; // blank space while redirecting
  }

  return (
    <div className="flex min-h-screen bg-[oklch(0.97_0.005_260)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white shadow-elevated transition-transform duration-300 md:translate-x-0 md:static md:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-gradient font-display text-sm font-bold text-white shadow-brand-glow">
            SL
          </span>
          <div>
            <div className="font-display text-sm font-bold leading-tight">SL SHOPEE</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin Panel</div>
          </div>
          <button
            className="ml-auto grid h-8 w-8 place-items-center rounded-md hover:bg-muted md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-brand text-white shadow-brand-glow"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="h-3 w-3 opacity-70" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border/60 p-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <Store className="h-4 w-4" /> View Store
          </Link>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out?")) {
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("user-changed"));
                window.location.href = "/";
              }
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border/60 bg-white px-4 sm:px-6">
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-base font-semibold text-foreground">
              {NAV_ITEMS.find((n) => isActive(n.to, n.exact))?.label ?? "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
              <span className="text-xs font-semibold text-brand">Admin</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  localStorage.removeItem("user");
                  window.dispatchEvent(new Event("user-changed"));
                  window.location.href = "/";
                }
              }}
              className="flex items-center gap-2 rounded-lg ml-2 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
