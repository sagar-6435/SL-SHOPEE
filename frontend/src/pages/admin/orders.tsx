import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Eye, Trash2, X, ShoppingCart, Loader2 } from "lucide-react";
import { ordersApi, type OrderAPI } from "@/lib/api";
import { BRANCHES } from "@/lib/site-data";

export const Route = createFileRoute("/admin/orders")({
    component: OrdersManagement,
});

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_STYLES: Record<string, string> = {
    cash: "bg-emerald-50 text-emerald-700",
    emi: "bg-purple-50 text-purple-700",
    upi: "bg-indigo-50 text-indigo-700",
    card: "bg-sky-50 text-sky-700",
};

export function OrdersManagement() {
    const [orders, setOrders] = useState<OrderAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterBranch, setFilterBranch] = useState("All");
    const [viewOrder, setViewOrder] = useState<OrderAPI | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await ordersApi.getAll();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = orders.filter((o) => {
        const matchSearch =
            o.customer.toLowerCase().includes(search.toLowerCase()) ||
            o.product.toLowerCase().includes(search.toLowerCase()) ||
            o._id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "All" || o.status === filterStatus;
        const matchBranch = filterBranch === "All" || o.branch === filterBranch;
        return matchSearch && matchStatus && matchBranch;
    });

    const updateStatus = async (id: string, status: OrderAPI["status"]) => {
        try {
            const updated = await ordersApi.updateStatus(id, status);
            setOrders(orders.map((o) => (o._id === id ? updated : o)));
            if (viewOrder?._id === id) setViewOrder(updated);
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const del = async (id: string) => {
        try {
            await ordersApi.delete(id);
            setOrders(orders.filter((o) => o._id !== id));
            setDeleteId(null);
        } catch (err) {
            console.error("Failed to delete order:", err);
        }
    };

    const totalRevenue = filtered
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + o.amountNum, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="font-display text-xl font-bold">Orders</h2>
                    <p className="text-sm text-muted-foreground">
                        {orders.length} orders · Revenue: ₹{totalRevenue.toLocaleString("en-IN")}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(["pending", "confirmed", "delivered", "cancelled"] as const).map((s) => {
                        const count = orders.filter((o) => o.status === s).length;
                        return (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${filterStatus === s
                                    ? STATUS_STYLES[s] + " ring-2 ring-offset-1 ring-current"
                                    : STATUS_STYLES[s] + " opacity-70 hover:opacity-100"
                                    }`}
                            >
                                {s} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by order ID, customer, or product..."
                        className="w-full rounded-xl border border-border bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand"
                    />
                </div>
                <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                >
                    <option value="All">All Branches</option>
                    {BRANCHES.map((b) => (
                        <option key={b.slug} value={b.name}>{b.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-border/60 bg-white shadow-elevated overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/40 bg-muted/30">
                                {["Order", "Customer", "Product", "Branch", "Amount", "Payment", "Status", "Date", "Actions"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                                        <ShoppingCart className="mx-auto mb-2 h-8 w-8 opacity-30" />No orders found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((o) => (
                                    <tr key={o._id} className="border-b border-border/30 hover:bg-muted/20">
                                        <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{o._id.slice(-8)}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-medium">{o.customer}</div>
                                            <div className="text-[10px] text-muted-foreground">{o.phone}</div>
                                        </td>
                                        <td className="px-4 py-3.5 text-muted-foreground max-w-[160px] truncate">{o.product}</td>
                                        <td className="px-4 py-3.5 text-muted-foreground text-xs">{o.branch}</td>
                                        <td className="px-4 py-3.5 font-semibold text-brand">{o.amount}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${PAYMENT_STYLES[o.paymentMode]}`}>
                                                {o.paymentMode}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateStatus(o._id, e.target.value as OrderAPI["status"])}
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase border-none outline-none cursor-pointer ${STATUS_STYLES[o.status]}`}
                                            >
                                                {(["pending", "confirmed", "delivered", "cancelled"] as const).map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">{o.date}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setViewOrder(o)}
                                                    className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-brand"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(o._id)}
                                                    className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Order Modal */}
            {viewOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-elevated">
                        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                            <h3 className="font-display font-semibold">Order Details</h3>
                            <button onClick={() => setViewOrder(null)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm text-muted-foreground">{viewOrder._id.slice(-8)}</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${STATUS_STYLES[viewOrder.status]}`}>
                                    {viewOrder.status}
                                </span>
                            </div>
                            <div className="grid gap-3 text-sm">
                                <DetailRow label="Customer" value={viewOrder.customer} />
                                <DetailRow label="Phone" value={viewOrder.phone} />
                                <DetailRow label="Product" value={viewOrder.product} />
                                <DetailRow label="Category" value={viewOrder.category} />
                                <DetailRow label="Branch" value={viewOrder.branch} />
                                <DetailRow label="Amount" value={viewOrder.amount} highlight />
                                <DetailRow label="Payment" value={viewOrder.paymentMode.toUpperCase()} />
                                <DetailRow label="Date" value={viewOrder.date} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Update Status</label>
                                <select
                                    value={viewOrder.status}
                                    onChange={(e) => updateStatus(viewOrder._id, e.target.value as OrderAPI["status"])}
                                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                                >
                                    {(["pending", "confirmed", "delivered", "cancelled"] as const).map((s) => (
                                        <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end border-t border-border/60 px-5 py-4">
                            <button onClick={() => setViewOrder(null)} className="rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-brand-glow">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
                        <h3 className="font-display font-semibold">Delete Order?</h3>
                        <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone.</p>
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-border py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                            <button onClick={() => del(deleteId)} className="flex-1 rounded-xl bg-destructive py-2 text-sm font-semibold text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className={highlight ? "font-semibold text-brand" : "font-medium"}>{value}</span>
        </div>
    );
}
