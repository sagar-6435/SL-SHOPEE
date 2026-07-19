import React, { useState, useEffect, useRef } from 'react';
import { Tag } from 'lucide-react';
import api from '../utils/api';
import ProductCard from './ProductCard';

const DealsSection = () => {
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -280 : 280;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchDeal = async () => {
            try {
                const response = await api.get('/api/deals');
                if (response && response.products && response.products.length > 0) {
                    // Map _id to id for ProductCard compatibility
                    const formattedProducts = response.products.map(p => ({
                        ...p,
                        id: p._id || p.id
                    }));
                    setDeal({ ...response, products: formattedProducts });
                } else {
                    setDeal(null);
                }
            } catch (error) {
                console.error('Error fetching deals:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeal();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex justify-center items-center">
                <div className="animate-pulse bg-gray-200 h-10 w-48 rounded"></div>
            </div>
        );
    }

    if (!deal || !deal.products || deal.products.length === 0) {
        return null;
    }

    const bgStyle = deal.bgImage_url
        ? { backgroundImage: `url(${deal.bgImage_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};

    const overlayClass = deal.bgImage_url ? "absolute inset-0 bg-white/20 backdrop-blur-xs" : "";

    return (
        <div className={`py-16 md:py-24 relative overflow-hidden ${!deal.bgImage_url ? 'bg-gradient-to-br from-amber-50 to-orange-50' : ''}`} style={bgStyle}>
            {deal.bgImage_url && <div className={overlayClass}></div>}
            {/* Decorative background elements when no custom image */}
            {!deal.bgImage_url && (
                <>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                </>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {deal.icon_url ? (
                                <span className="bg-amber-100 p-3 rounded-xl flex items-center justify-center">
                                    <img src={deal.icon_url} alt="Deals Icon" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                                </span>
                            ) : (
                                <span className="bg-amber-100 text-amber-700 p-3 rounded-xl flex items-center justify-center">
                                    <Tag className="w-8 h-8 md:w-10 md:h-10" />
                                </span>
                            )}
                            <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 tracking-tight">
                                {deal.name || 'Special Offers'}
                            </h2>
                        </div>
                        {deal.offerPercentage > 0 && (
                            <p className="font-body text-gray-600 text-lg md:text-xl mt-2 flex items-center gap-2">
                                Get up to <span className="font-bold text-green-600 text-2xl">{deal.offerPercentage}% Off</span> on selected items
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative group mt-8">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-amber-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex border border-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Scrollable Track */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory pb-8 pt-4 custom-scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
                        `}} />
                        {deal.products.map((product, index) => (
                            <div
                                key={product.id || index}
                                className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[240px] snap-center sm:snap-start"
                            >
                                <ProductCard product={product} showWishlist={true} />
                            </div>
                        ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-amber-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex border border-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DealsSection;
