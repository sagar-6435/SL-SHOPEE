import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, X, Image, Star, StarOff, Search, Grid3X3, List, Upload, Loader2 } from "lucide-react";
import { galleryApi, type GalleryItemAPI } from "@/lib/api";

export const Route = createFileRoute("/admin/gallery")({
    component: GalleryManagement,
});

const GALLERY_CATEGORIES = ["All", "Furniture", "Televisions", "Air Conditioners", "Branches", "Promotions", "Washing Machines"];

export function GalleryManagement() {
    const [items, setItems] = useState<GalleryItemAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("All");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [featured, setFeatured] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch gallery items on mount
    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const data = await galleryApi.getAll();
            setItems(data);
        } catch (err) {
            console.error("Failed to fetch gallery:", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = items.filter((item) => {
        const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "All" || item.category === filterCat;
        return matchSearch && matchCat;
    });

    const toggleFeatured = async (id: string) => {
        try {
            const updated = await galleryApi.toggleFeatured(id);
            setItems(items.map((i) => (i._id === id ? updated : i)));
        } catch (err) {
            console.error("Failed to toggle featured:", err);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => setPreviewSrc(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const add = async () => {
        if (!title || !selectedFile) return;
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("title", title);
            formData.append("category", category);
            formData.append("featured", String(featured));

            const newItem = await galleryApi.create(formData);
            setItems([newItem, ...items]);
            closeModal();
        } catch (err) {
            console.error("Failed to add gallery item:", err);
        } finally {
            setSaving(false);
        }
    };

    const closeModal = () => {
        setModal(false);
        setTitle("");
        setCategory("");
        setFeatured(false);
        setSelectedFile(null);
        setPreviewSrc(null);
    };

    const del = async (id: string) => {
        try {
            await galleryApi.delete(id);
            setItems(items.filter((i) => i._id !== id));
            setDeleteId(null);
        } catch (err) {
            console.error("Failed to delete gallery item:", err);
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
                    <h2 className="font-display text-xl font-bold">Gallery</h2>
                    <p className="text-sm text-muted-foreground">
                        {items.length} items · {items.filter((i) => i.featured).length} featured
                    </p>
                </div>
                <button
                    onClick={() => { closeModal(); setModal(true); }}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow hover:scale-[1.02] transition-transform"
                >
                    <Plus className="h-4 w-4" /> Add Image
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search gallery..."
                        className="w-full rounded-xl border border-border bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand"
                    />
                </div>
                <div className="flex overflow-x-auto rounded-xl border border-border scrollbar-none">
                    {GALLERY_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterCat(cat)}
                            className={`shrink-0 px-3 py-2 text-xs font-medium transition-colors ${filterCat === cat ? "bg-brand text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex rounded-xl border border-border overflow-hidden">
                    <button
                        onClick={() => setView("grid")}
                        className={`grid h-[42px] w-[42px] place-items-center ${view === "grid" ? "bg-brand text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setView("list")}
                        className={`grid h-[42px] w-[42px] place-items-center ${view === "list" ? "bg-brand text-white" : "bg-white text-muted-foreground hover:bg-muted"}`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Gallery Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Image className="mb-2 h-8 w-8 opacity-30" />
                    <span>No gallery items found</span>
                </div>
            ) : view === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((item) => (
                        <div key={item._id} className="group relative rounded-2xl border border-border/60 bg-white shadow-elevated overflow-hidden">
                            <div
                                className="relative aspect-[4/3] cursor-pointer overflow-hidden"
                                onClick={() => setPreviewUrl(item.url)}
                            >
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {item.featured && (
                                    <div className="absolute top-2 left-2 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-yellow-900 shadow">
                                        ★ Featured
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-display font-semibold text-sm">{item.title}</h3>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.category}</span>
                                    <span className="text-[10px] text-muted-foreground">{item.uploadedAt}</span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => toggleFeatured(item._id)}
                                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-colors ${item.featured
                                            ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                            : "border-border text-muted-foreground hover:border-yellow-300 hover:text-yellow-700"
                                            }`}
                                    >
                                        {item.featured ? <StarOff className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                                        {item.featured ? "Unfeature" : "Feature"}
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(item._id)}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-medium hover:border-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List view */
                <div className="rounded-2xl border border-border/60 bg-white shadow-elevated overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/40 bg-muted/30">
                                    {["Image", "Title", "Category", "Date", "Featured", "Actions"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item._id} className="border-b border-border/30 hover:bg-muted/20">
                                        <td className="px-4 py-3">
                                            <img src={item.url} alt={item.title} className="h-10 w-14 rounded-lg object-cover cursor-pointer" onClick={() => setPreviewUrl(item.url)} />
                                        </td>
                                        <td className="px-4 py-3 font-medium">{item.title}</td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">{item.category}</td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">{item.uploadedAt}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => toggleFeatured(item._id)} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.featured ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                                                {item.featured ? "★ Featured" : "—"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setDeleteId(item._id)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-elevated">
                        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                            <h3 className="font-display font-semibold">Add Gallery Item</h3>
                            <button onClick={closeModal} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid gap-4 p-5">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-brand" placeholder="e.g. Showroom Interior" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upload Image</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-3 py-6 text-sm text-muted-foreground hover:border-brand hover:text-brand transition-colors"
                                >
                                    <Upload className="h-5 w-5" />
                                    {selectedFile ? selectedFile.name : "Click to select image"}
                                </button>
                            </div>
                            {previewSrc && (
                                <div className="rounded-xl overflow-hidden border border-border">
                                    <img src={previewSrc} alt="Preview" className="h-32 w-full object-cover" />
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-brand">
                                    <option value="">Select category</option>
                                    {GALLERY_CATEGORIES.filter((c) => c !== "All").map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-border text-brand" />
                                <span className="text-sm font-medium">Mark as Featured</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-border/60 px-5 py-4">
                            <button onClick={closeModal} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                            <button onClick={add} disabled={!title || !selectedFile || saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-brand-glow disabled:opacity-50">
                                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                {saving ? "Uploading..." : "Add Item"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image preview lightbox */}
            {previewUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewUrl(null)}>
                    <div className="relative max-w-3xl max-h-[80vh]">
                        <button className="absolute -top-10 right-0 text-white hover:text-white/80" onClick={() => setPreviewUrl(null)}>
                            <X className="h-6 w-6" />
                        </button>
                        <img src={previewUrl} alt="Preview" className="max-h-[80vh] rounded-2xl object-contain" />
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-elevated">
                        <h3 className="font-display font-semibold">Delete Gallery Item?</h3>
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
