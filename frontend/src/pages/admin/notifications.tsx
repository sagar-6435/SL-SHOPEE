import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Bell, Send, Search, BellRing, ShoppingCart, Megaphone, Loader2 } from "lucide-react";
import { notificationsApi, type NotificationAPI } from "@/lib/api";

export const Route = createFileRoute("/admin/notifications")({
    component: NotificationsManagement,
});

const STATUS_STYLES: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-green-100 text-green-700",
};

const TYPE_STYLES: Record<string, { bg: string; icon: typeof Bell }> = {
    promo: { bg: "bg-purple-100 text-purple-700", icon: Megaphone },
    order: { bg: "bg-blue-100 text-blue-700", icon: ShoppingCart },
    general: { bg: "bg-amber-100 text-amber-700", icon: BellRing },
};

export function NotificationsManagement() {
    const [notifications, setNotifications] = useState<NotificationAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [modal, setModal] = useState<"add" | "edit" | null>(null);
    const [editing, setEditing] = useState<NotificationAPI | null>(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [type, setType] = useState<"promo" | "order" | "general">("general");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchNotifications(); }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationsApi.getAll();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = notifications.filter((n) => {
        const matchSearch =
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.body.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === "All" || n.type === filterType;
        return matchSearch && matchType;
    });

    const resetForm = () => { setTitle(""); setBody(""); setType("general"); };
    const openAdd = () => { resetForm(); setModal("add"); };
    const openEdit = (n: NotificationAPI) => {
        setEditing(n); setTitle(n.title); setBody(n.body); setType(n.type); setModal("edit");
    };
    const closeModal = () => { setModal(null); setEditing(null); resetForm(); };

    const save = async () => {
        try {
            setSaving(true);
            if (modal === "add") {
                const newNotif = await notificationsApi.create({
                    title, body, type, status: "draft", recipients: 0,
                } as any);
                setNotifications([newNotif, ...notifications]);
            } else if (modal === "edit" && editing) {
                const updated = await notificationsApi.update(editing._id, { title, body, type });
                setNotifications(notifications.map((n) => (n._id === editing._id ? updated : n)));
            }
            closeModal();
        } catch (err) {
            console.error("Failed to save notification:", err);
        } finally {
            setSaving(false);
        }
    };

    const sendNotification = async (id: string) => {
        try {
            const updated = await notificationsApi.send(id);
            setNotifications(notifications.map((n) => (n._id === id ? updated : n)));
        } catch (err) {
            console.error("Failed to send notification:", err);
        }
    };

    const del = async (id: string) => {
        try {
            await notificationsApi.delete(id);
            setNotifications(notifications.filter((n) => n._id !== id));
            setDeleteId(null);
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="font-display text-xl font-bold">Notifications</h2>
                    <p className="text-sm text-muted-foreground">
                        {notifications.length} notifications · {notifications.filter((n) => n.status === "sent").length} sent
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow hover:scale-[1.02] transition-transform"
                >
                    <Plus className="h-4 w-4" /> New Notification
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notifications..."
                        className="w-full rounded-xl border border-border bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand"
                    />
                </div>
                <div className="flex overflow-x-auto rounded-xl border border-border scrollbar-none">
                    {["All", "promo", "order", "general"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={`shrink-0 px-3 py-2 text-xs font-medium capitalize transition-colors ${filterType === t ? "bg-brand text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}
                        >
                            {t === "All" ? "All" : t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notification list */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Bell className="mb-2 h-8 w-8 opacity-30" />
                    <span>No notifications found</span>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((n) => {
                        const typeConf = TYPE_STYLES[n.type] || TYPE_STYLES.general;
                        const TypeIcon = typeConf.icon;
                        return (
                            <div key={n._id} className="rounded-2xl border border-border/60 bg-white p-5 shadow-elevated">
                                <div className="flex items-start gap-4">
                                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${typeConf.bg}`}>
                                        <TypeIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-display font-semibold text-sm">{n.title}</h3>
                                                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${STATUS_STYLES[n.status]}`}>
                                                    {n.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${typeConf.bg}`}>
                                                    {n.type}
                                                </span>
                                                <span>{n.recipients} recipients</span>
                                                {n.sentAt && <span>Sent: {n.sentAt}</span>}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {n.status === "draft" && (
                                                    <button
                                                        onClick={() => sendNotification(n._id)}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-green-700"
                                                    >
                                                        <Send className="h-3 w-3" /> Send
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openEdit(n)}
                                                    className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-brand"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(n._id)}
                                                    className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-elevated">
                        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                            <h3 className="font-display font-semibold">{modal === "add" ? "New Notification" : "Edit Notification"}</h3>
                            <button onClick={closeModal} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid gap-4 p-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                                    placeholder="e.g. Order Confirmed"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Body</label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={3}
                                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-brand resize-none"
                                    placeholder="Notification message..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as typeof type)}
                                    className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-brand"
                                >
                                    <option value="general">General</option>
                                    <option value="promo">Promotional</option>
                                    <option value="order">Order Update</option>
                                </select>
                            </div>
                        </div>

                        {/* Preview */}
                        {title && body && (
                            <div className="mx-5 mb-4 rounded-xl border border-border/60 bg-muted/30 p-4">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Push Preview</p>
                                <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                                        <Bell className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{body}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 border-t border-border/60 px-5 py-4">
                            <button onClick={closeModal} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                            <button
                                onClick={save}
                                disabled={!title || !body || saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-brand-glow disabled:opacity-50"
                            >
                                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                {modal === "add" ? "Create" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
                        <h3 className="font-display font-semibold">Delete Notification?</h3>
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
