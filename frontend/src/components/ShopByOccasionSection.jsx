import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fullUrl } from '../lib/utils';

const ShopByOccasionSection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackCategories = [
    { id: 1, name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop' },
    { id: 2, name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { id: 3, name: "Smart TV's", slug: 'smart-tvs', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop' },
    { id: 4, name: 'Headphones', slug: 'headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
    { id: 5, name: 'Cameras', slug: 'cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop' },
    { id: 6, name: 'Tablets', slug: 'tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop' },
    { id: 7, name: 'Refrigerators', slug: 'refrigerators', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&h=200&fit=crop' },
    { id: 8, name: 'Washing Machine', slug: 'washing-machines', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=200&fit=crop' },
    { id: 9, name: 'Air Conditioners', slug: 'air-conditioners', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop' },
    { id: 10, name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200&h=200&fit=crop' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        const allCats = data.categories || [];

        // Show up to 10 categories sorted by order
        const sorted = allCats
          .sort((a, b) => (a.occasion_order || a.id || 0) - (b.occasion_order || b.id || 0))
          .slice(0, 10);

        // If no categories returned, use fallback list
        const finalCats = sorted.length > 0 ? sorted : fallbackCategories;

        setCategories(finalCats);
      } else {
        setCategories(fallbackCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/shop/${categorySlug}`);
  };

  return (
    <section className="py-4 bg-white">
      <div className="container-custom">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-gray-400 font-bold mb-4">Find the perfect Electronics</p>
          <h2 className="section-title">Shop by Category</h2>
        </div>

        {/* Circular Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug || category.id)}
              className="group flex flex-col items-center gap-4 transition-all duration-500 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-gray-400 shadow-lg shadow-gray-200 transition-all duration-500 group-hover:shadow-[var(--color-primary-light)] group-hover:border-[var(--color-primary-light)]">
                <img
                  src={
                    category.image_url
                      ? (category.image_url.startsWith('http') ? category.image_url : fullUrl(category.image_url))
                      : (category.image || `https://via.placeholder.com/200`)
                  }
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
              </div>
              {/* Category Name */}
              <p className="font-body text-sm font-semibold text-gray-700 transition-colors group-hover:text-[var(--color-primary)]">
                {category.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasionSection;
