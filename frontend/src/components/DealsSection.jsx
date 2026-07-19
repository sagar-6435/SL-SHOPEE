import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import api from '../utils/api';
import ProductCard from './ProductCard';

const DealsSection = () => {
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);

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
                                <span className="bg-amber-100 p-2 rounded-lg flex items-center justify-center">
                                    <img src={deal.icon_url} alt="Deals Icon" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
                                </span>
                            ) : (
                                <span className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                                    <Tag className="w-5 h-5 md:w-6 md:h-6" />
                                </span>
                            )}
                            <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 tracking-tight">
                                {deal.name || 'Special Offers'}
                            </h2>
                        </div>
                        {deal.offerPercentage > 0 && (
                            <p className="font-body text-gray-600 text-lg md:text-xl mt-2 flex items-center gap-2">
                                Get up to <span className="font-bold text-amber-600 text-2xl">{deal.offerPercentage}% Off</span> on selected items
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {deal.products.map((product) => (
                        <ProductCard key={product.id} product={product} showWishlist={true} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DealsSection;
