import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { galleryApi, type GalleryItemAPI } from '@/lib/api';
import { WhatsAppFab } from '@/components/whatsapp-fab';

export const Route = createFileRoute('/gallery')({
    head: () => ({
        meta: [
            { title: 'Gallery — SL SHOPEE' },
            { name: 'description', content: 'Explore the SL SHOPEE gallery to see our products and stores.' },
        ],
    }),
    component: GalleryPage,
});

export function GalleryPage() {
    const [items, setItems] = useState<GalleryItemAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCat, setFilterCat] = useState('All');

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const data = await galleryApi.getAll();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch gallery:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...Array.from(new Set(items.map((i) => i.category || 'Uncategorized').filter(Boolean)))];

    const filtered = items.filter((item) => {
        const matchCat = filterCat === 'All' || item.category === filterCat;
        return matchCat;
    });

    return (
        <div className="pb-10 pt-32 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Our Showrooms & Products</p>
                <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Gallery
                </h1>
                <p className="mt-3 max-w-xl text-muted-foreground">Take a look inside our branches and see our wide range of products.</p>

                {/* Categories */}
                <div className="mt-10 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterCat(cat)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${filterCat === cat ? 'bg-foreground text-background' : 'bg-white border border-border text-foreground hover:border-brand hover:text-brand shadow-sm'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="mt-10">
                    {loading ? (
                        <div className="flex items-center justify-center py-32">
                            <Loader2 className="h-10 w-10 animate-spin text-brand" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                            <ImageIcon className="mb-4 h-12 w-12 opacity-30" />
                            <p className="text-lg">No generic items found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((item, i) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted shadow-elevated"
                                >
                                    <img
                                        src={item.url}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 pt-16 flex flex-col justify-end translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <span className="text-[10px] uppercase tracking-wider text-brand font-bold">{item.category}</span>
                                        <h3 className="font-display font-semibold text-white text-lg mt-1">{item.title}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <WhatsAppFab />
        </div>
    );
}
