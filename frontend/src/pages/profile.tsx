import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ShoppingCart, Heart, Package, User, MapPin } from 'lucide-react';

export const Route = createFileRoute('/profile')({
  component: PageComponent,
});

export function PageComponent() {
  const [user, setUser] = useState<{ name: string, email?: string } | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [address, setAddress] = useState({ street: "", city: "", pincode: "", phone: "" });
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedAddress = localStorage.getItem("userAddress");
    if (savedAddress) setAddress(JSON.parse(savedAddress));
  }, []);

  const TABS = [
    { id: 'profile', label: 'My Details', icon: User },
    { id: 'address', label: 'Delivery Address', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/wishlist' },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, path: '/cart' },
  ];

  if (!user) {
    return (
      <div className="pt-32 pb-10 min-h-screen bg-[oklch(0.98_0.005_260)] flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Please log in to view your profile.</h2>
        <Link to="/Login" className="rounded-full bg-brand-gradient px-6 py-2.5 text-white font-medium">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-10 min-h-screen bg-[oklch(0.98_0.005_260)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Mobile tab strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:hidden scrollbar-none mb-6">
          {TABS.map(tab => (
            tab.path ? (
              <a
                key={tab.id}
                href={tab.path}
                className="flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium text-sm bg-white text-muted-foreground border border-border/60"
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </a>
            ) : (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id ? "bg-brand text-brand-foreground shadow-brand-glow" : "bg-white text-muted-foreground border border-border/60"
                  }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            )
          ))}
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">

        {/* Sidebar Tabs — desktop only */}
        <div className="hidden md:block space-y-2">
          {TABS.map(tab => (
            tab.path ? (
              <Link
                key={tab.id}
                to={tab.path}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm bg-white text-muted-foreground hover:text-foreground border border-border/60 hover:border-brand/30"
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </Link>
            ) : (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id ? "bg-brand text-brand-foreground shadow-brand-glow" : "bg-white text-muted-foreground hover:text-foreground border border-border/60 hover:border-brand/30"
                  }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            )
          ))}
        </div>

        {/* Content Area */}
        <div className="rounded-3xl border border-border/60 bg-white p-5 sm:p-8 shadow-elevated">
          {activeTab === 'profile' && (
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Welcome, {user.name}</h1>
              <p className="mt-2 text-muted-foreground">Manage your personal details and preferences.</p>
              <form className="mt-8 space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">Full Name</label>
                  <input className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-brand" defaultValue={user.name} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">Email Address</label>
                  <input className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-brand" defaultValue={user.email || "user@example.com"} />
                </div>
                <button type="button" onClick={(e) => {
                  e.preventDefault();
                  alert("Profile updated successfully!");
                }} className="rounded-xl bg-brand-gradient px-6 py-3 text-white font-medium text-sm w-full mt-4">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'address' && (
            <div>
              <h2 className="font-display text-2xl font-bold">Delivery Address</h2>
              <p className="mt-2 text-muted-foreground">Manage your shipping address for smooth deliveries.</p>
              <form className="mt-8 space-y-4 max-w-md">
                <div className="relative border border-border rounded-xl focus-within:border-brand transition-colors bg-white">
                  <input id="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="peer w-full bg-transparent px-4 py-3 pt-5 outline-none placeholder-transparent" placeholder="Street Address" />
                  <label htmlFor="street" className="absolute left-4 top-2 cursor-text text-[10px] uppercase font-bold text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:-translate-y-0.5 peer-focus:font-bold peer-focus:text-brand">Street Address</label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative border border-border rounded-xl focus-within:border-brand transition-colors bg-white">
                    <input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="peer w-full bg-transparent px-4 py-3 pt-5 outline-none placeholder-transparent" placeholder="City" />
                    <label htmlFor="city" className="absolute left-4 top-2 cursor-text text-[10px] uppercase font-bold text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:-translate-y-0.5 peer-focus:font-bold peer-focus:text-brand">City</label>
                  </div>
                  <div className="relative border border-border rounded-xl focus-within:border-brand transition-colors bg-white">
                    <input id="pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="peer w-full bg-transparent px-4 py-3 pt-5 outline-none placeholder-transparent" placeholder="Pincode" />
                    <label htmlFor="pincode" className="absolute left-4 top-2 cursor-text text-[10px] uppercase font-bold text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:-translate-y-0.5 peer-focus:font-bold peer-focus:text-brand">Pincode</label>
                  </div>
                </div>
                <div className="relative border border-border rounded-xl focus-within:border-brand transition-colors bg-white">
                  <input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="peer w-full bg-transparent px-4 py-3 pt-5 outline-none placeholder-transparent" placeholder="Phone Number" />
                  <label htmlFor="phone" className="absolute left-4 top-2 cursor-text text-[10px] uppercase font-bold text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:text-foreground/50 peer-focus:top-2 peer-focus:text-[10px] peer-focus:-translate-y-0.5 peer-focus:font-bold peer-focus:text-brand">Phone Number</label>
                </div>
                <button type="button" onClick={(e) => {
                  e.preventDefault();
                  localStorage.setItem("userAddress", JSON.stringify(address));
                  setAddressSaved(true);
                  setTimeout(() => setAddressSaved(false), 2500);
                }} className="rounded-xl bg-brand-gradient px-6 py-3 text-white font-medium text-sm w-full mt-4 transition-transform hover:scale-[1.02]">
                  {addressSaved ? "Address Saved Successfully!" : "Save Address"}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="font-display text-2xl font-bold">My Orders</h2>
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/30 py-16">
                <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <span className="text-sm text-muted-foreground">You have no recent orders.</span>
                <Link to="/products" className="mt-4 text-brand text-sm font-semibold hover:underline">Start Shopping</Link>
              </div>
            </div>
          )}


        </div>
        </div>
      </div>
    </div>
  );
}
