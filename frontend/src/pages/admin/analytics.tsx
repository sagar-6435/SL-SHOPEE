import { createFileRoute } from "@tanstack/react-router";
import { MONTHLY_SALES, CATEGORY_SALES, BRANCH_SALES, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_PRODUCTS } from "@/lib/admin-data";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
    LineChart, Line, AreaChart, Area, CartesianGrid, Legend, RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Package, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
    component: AnalyticsPage,
});

const PIE_COLORS = [
    "oklch(0.52 0.18 10)", "oklch(0.6 0.15 30)", "oklch(0.68 0.14 50)",
    "oklch(0.55 0.16 200)", "oklch(0.62 0.18 140)", "oklch(0.58 0.12 270)",
];

const PAYMENT_DATA = [
    { mode: "EMI", count: INITIAL_ORDERS.filter((o) => o.paymentMode === "emi").length },
    { mode: "UPI", count: INITIAL_ORDERS.filter((o) => o.paymentMode === "upi").length },
    { mode: "Card", count: INITIAL_ORDERS.filter((o) => o.paymentMode === "card").length },
    { mode: "Cash", count: INITIAL_ORDERS.filter((o) => o.paymentMode === "cash").length },
];

const STATUS_DATA = [
    { status: "Delivered", count: INITIAL_ORDERS.filter((o) => o.status === "delivered").length },
    { status: "Confirmed", count: INITIAL_ORDERS.filter((o) => o.status === "confirmed").length },
    { status: "Pending", count: INITIAL_ORDERS.filter((o) => o.status === "pending").length },
    { status: "Cancelled", count: INITIAL_ORDERS.filter((o) => o.status === "cancelled").length },
];

const STATUS_COLORS = ["oklch(0.6 0.18 150)", "oklch(0.55 0.16 240)", "oklch(0.7 0.16 80)", "oklch(0.55 0.18 20)"];

const totalRevenue = INITIAL_ORDERS.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.amountNum, 0);
const avgOrderValue = Math.round(totalRevenue / INITIAL_ORDERS.filter((o) => o.status !== "cancelled").length);

export function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-display text-xl font-bold">Analytics</h2>
                <p className="text-sm text-muted-foreground">Complete business intelligence overview</p>
            </div>

            {/* KPI Row */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    icon={IndianRupee}
                    label="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString("en-IN")}`}
                    change="+12.5%"
                    trend="up"
                    color="brand"
                />
                <KpiCard
                    icon={ShoppingCart}
                    label="Avg. Order Value"
                    value={`₹${avgOrderValue.toLocaleString("en-IN")}`}
                    change="+8.3%"
                    trend="up"
                    color="blue"
                />
                <KpiCard
                    icon={Users}
                    label="Active Customers"
                    value={String(INITIAL_CUSTOMERS.filter((c) => c.status === "active").length)}
                    change="+3"
                    trend="up"
                    color="green"
                />
                <KpiCard
                    icon={Package}
                    label="Active Products"
                    value={String(INITIAL_PRODUCTS.filter((p) => p.status === "active").length)}
                    change="-1"
                    trend="down"
                    color="orange"
                />
            </div>

            {/* Revenue Trend (Area) + Category Pie */}
            <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
                <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-elevated">
                    <h3 className="font-display font-semibold">Revenue Trend</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Monthly revenue with orders overlay</p>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MONTHLY_SALES}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="oklch(0.52 0.18 10)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="oklch(0.52 0.18 10)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.929 0.013 255.508)" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip formatter={(v: number, name: string) => [name === "revenue" ? `₹${v.toLocaleString("en-IN")}` : v, name === "revenue" ? "Revenue" : "Orders"]} contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid oklch(0.929 0.013 255.508)" }} />
                                <Area type="monotone" dataKey="revenue" stroke="oklch(0.52 0.18 10)" strokeWidth={2.5} fill="url(#revenueGrad)" />
                                <Line type="monotone" dataKey="orders" stroke="oklch(0.55 0.16 240)" strokeWidth={2} dot={{ fill: "oklch(0.55 0.16 240)", r: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-elevated">
                    <h3 className="font-display font-semibold">Sales by Category</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Revenue share breakdown</p>
                <div className="mt-2 flex items-center justify-center">
                        <PieChart width={180} height={180}>
                            <Pie data={CATEGORY_SALES} dataKey="revenue" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                                {CATEGORY_SALES.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        </PieChart>
                    </div>
                    <div className="mt-2 space-y-1.5">
                        {CATEGORY_SALES.map((c, i) => (
                            <div key={c.category} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                                    <span className="text-muted-foreground">{c.category}</span>
                                </div>
                                <span className="font-semibold">₹{c.revenue.toLocaleString("en-IN")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Branch Performance + Payment Modes */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-elevated">
                    <h3 className="font-display font-semibold">Branch Performance</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Revenue by branch</p>
                    <div className="mt-4 h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={BRANCH_SALES} barSize={32}>
                                <XAxis dataKey="branch" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid oklch(0.929 0.013 255.508)" }} />
                                <Bar dataKey="revenue" fill="oklch(0.52 0.18 10)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-elevated">
                    <h3 className="font-display font-semibold">Payment Modes</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Distribution of payment methods</p>
                    <div className="mt-4 h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={PAYMENT_DATA} barSize={40} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="mode" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid oklch(0.929 0.013 255.508)" }} />
                                <Bar dataKey="count" fill="oklch(0.55 0.16 240)" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Order Status + Category Radar */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-elevated">
                    <h3 className="font-display font-semibold">Order Status Distribution</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Current order pipeline</p>
                    <div className="mt-4 flex items-center justify-center">
                        <PieChart width={220} height={200}>
                            <Pie data={STATUS_DATA} dataKey="count" cx="50%" cy="50%" outerRadius={80} paddingAngle={4} label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}>
                                {STATUS_DATA.map((_, i) => (
                                    <Cell key={i} fill={STATUS_COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                        </PieChart>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-elevated">
                    <h3 className="font-display font-semibold">Category Units Radar</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Units sold by category</p>
                    <div className="mt-4 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={210}>
                            <RadarChart cx="50%" cy="50%" outerRadius={80} data={CATEGORY_SALES}>
                                <PolarGrid stroke="oklch(0.929 0.013 255.508)" />
                                <PolarAngleAxis dataKey="category" tick={{ fontSize: 9 }} />
                                <PolarRadiusAxis tick={false} axisLine={false} />
                                <Radar dataKey="units" stroke="oklch(0.52 0.18 10)" fill="oklch(0.52 0.18 10)" fillOpacity={0.25} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top products table */}
            <div className="rounded-2xl border border-border/60 bg-white shadow-elevated">
                <div className="border-b border-border/60 px-5 py-4">
                    <h3 className="font-display font-semibold">Top-Selling Products</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">Based on order data</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/40 bg-muted/30">
                                {["#", "Product", "Category", "Orders", "Revenue"].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {INITIAL_ORDERS.filter((o) => o.status !== "cancelled")
                                .slice(0, 6)
                                .map((o, i) => (
                                    <tr key={o.id} className="border-b border-border/30 hover:bg-muted/20">
                                        <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{i + 1}</td>
                                        <td className="px-5 py-3.5 font-medium">{o.product}</td>
                                        <td className="px-5 py-3.5 text-muted-foreground text-xs">{o.category}</td>
                                        <td className="px-5 py-3.5">1</td>
                                        <td className="px-5 py-3.5 font-semibold text-brand">{o.amount}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function KpiCard({
    icon: Icon,
    label,
    value,
    change,
    trend,
    color,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    change: string;
    trend: "up" | "down";
    color: string;
}) {
    const colors: Record<string, string> = {
        brand: "bg-brand/10 text-brand",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        orange: "bg-orange-100 text-orange-600",
    };
    return (
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-elevated">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
                    <div className="mt-1 flex items-center gap-1">
                        {trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs font-semibold ${trend === "up" ? "text-green-600" : "text-red-500"}`}>{change}</span>
                        <span className="text-[10px] text-muted-foreground">vs last month</span>
                    </div>
                </div>
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${colors[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}
