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
                        const cat = prod.category?.slug || prod.category || 'uncategorized';
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

    if (loading) {
        return (
            <section className="py-16 bg-[#FAFAFA] flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 bg-[#FAFAFA]">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-slide-up">
                    <p className="text-xs tracking-[0.3em] text-[var(--color-primary)] font-bold mb-4 uppercase">
                        Curated Picks
                    </p>
                    <h2 className="section-title text-4xl lg:text-5xl font-display text-gray-900 font-bold mb-4">
                        Highlights from Every Category
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-orange-300 mx-auto rounded-full"></div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {products.map((product, index) => (
                        <div
                            key={product.id || index}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <ProductCard product={product} showWishlist={true} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategoriesProducts;
