import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const ShopPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0); // 0 translates to 'Any'
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('all');
    }
  }, [category]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products?`;
      if (selectedCategory !== 'all') {
        url += `category=${selectedCategory}&`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Derive displayed products using client side filtering/sorting
  const displayedProducts = useMemo(() => {
    let filtered = products.filter(p => p.price >= minPrice);
    if (maxPrice > 0) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    const sorted = [...filtered];
    if (sortBy === 'price_asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') sorted.sort((a, b) => b.price - a.price);

    return sorted;
  }, [products, minPrice, maxPrice, sortBy]);

  const handleCategoryChange = (catId) => {
    if (catId === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${catId}`);
    }
  };



  return (
    <div className="min-h-screen bg-white">

      {/* Page Title & Filter Bar */}
      {/* Filter & Category Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-6">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* Category Dropdown */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">Collection:</span>
              <div className="relative group min-w-[200px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-50 rounded-2xl px-6 py-3.5 pr-12 font-body text-sm font-bold text-gray-900 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-50 outline-none transition-all cursor-pointer shadow-sm hover:border-gray-100"
                >
                  <option value="all">All Products</option>
                  {categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-[var(--color-primary)] transition-colors" />
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border-2 border-transparent hover:border-gray-100 transition-colors">
                <span className="text-[10px] font-body font-bold text-gray-500 uppercase tracking-widest hidden sm:inline">Price:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-20 sm:w-28 px-2 py-1 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg outline-none focus:border-[var(--color-primary)] placeholder-gray-400"
                  />
                  <span className="text-gray-400 font-bold">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-20 sm:w-28 px-2 py-1 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg outline-none focus:border-[var(--color-primary)] placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Sort & Stats */}
            <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 w-full lg:w-auto">
              <div className="relative group min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-50 rounded-2xl px-6 py-3.5 pr-12 font-body text-sm font-bold text-gray-900 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-purple-50 outline-none transition-all cursor-pointer shadow-sm hover:border-gray-100"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-[var(--color-primary)] transition-colors" />
              </div>

              <p className="text-gray-400 font-body text-sm italic hidden sm:block whitespace-nowrap">
                Showing {displayedProducts.length} items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="py-4 bg-[#FAFAFA]">
        <div className="container-custom">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-16 h-16 border-4 border-gray-100 border-t-[var(--color-primary)] rounded-full animate-spin mb-4" />
              <p className="text-gray-400 font-body animate-pulse">Gathering gifts...</p>
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} showWishlist={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40">
              <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">No Gifts Found</h3>
              <p className="text-gray-500 font-body mb-8">We couldn't find any treasures matching your selection.</p>
              <button
                onClick={() => handleCategoryChange('all')}
                className="btn-primary"
              >
                View All Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

