import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const FeaturedCategoriesProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
                if (response.ok) {
                    const data = await response.json();
                    const allProducts = data.products || [];

                    // Group by category and pick the first product from each category
                    const categoryMap = new Map();
                    allProducts.forEach(prod => {
                        const cat = prod.category_slug || prod.category?.slug || prod.category || 'uncategorized';
                        if (!categoryMap.has(cat)) {
                            categoryMap.set(cat, prod);
                        }
                    });

                    // Limit to a sensible number if there are too many categories
                    const featured = Array.from(categoryMap.values()).slice(0, 8);
                    setProducts(featured);
                }
            } catch (error) {
                console.error('Failed to fetch featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollContainerRef = React.useRef(null);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <section className="pt-8 pb-4 bg-[#FAFAFA] flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="pt-4 pb-0 bg-[#FAFAFA] relative">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-6 animate-slide-up">
                    <p className="text-xs tracking-[0.3em] text-[var(--color-primary)] font-bold mb-2 uppercase">
                        Curated Picks
                    </p>
                    <h2 className="section-title text-4xl lg:text-5xl font-display text-gray-900 font-bold mb-2">
                        Highlights from Every Category
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-orange-300 mx-auto rounded-full"></div>
                </div>

                {/* Carousel Container */}
                <div className="relative group">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-[var(--color-primary)] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Scrollable Track */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 sm:gap-8 snap-x snap-mandatory pb-8 pt-4 custom-scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
                        `}} />
                        {products.map((product, index) => (
                            <div
                                key={product.id || index}
                                className="animate-slide-up flex-shrink-0 w-[280px] sm:w-[320px] snap-center sm:snap-start"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <ProductCard product={product} showWishlist={true} />
                            </div>
                        ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-[var(--color-primary)] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategoriesProducts;
