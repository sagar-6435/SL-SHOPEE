import { useState, useEffect } from 'react';
import { Tag, Save, Search, CheckSquare, Square } from 'lucide-react';
import api from '../../utils/api';

const DealsManagement = () => {
    const [dealData, setDealData] = useState({ name: 'Special Offers', offerPercentage: 0, products: [], bgImage_url: null, icon_url: null });
    const [bgImageFile, setBgImageFile] = useState(null);
    const [bgImagePreview, setBgImagePreview] = useState(null);
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [removeBgImage, setRemoveBgImage] = useState(false);
    const [removeIcon, setRemoveIcon] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDealsAndProducts();
    }, []);

    const fetchDealsAndProducts = async () => {
        setLoading(true);
        try {
            const [dealRes, productsRes] = await Promise.all([
                api.get('/api/deals'),
                api.get('/api/products?limit=1000') // Fetch a large number of products, assuming smaller catalog or handled via search
            ]);
            setDealData({
                name: dealRes.name || 'Special Offers',
                offerPercentage: dealRes.offerPercentage || 0,
                products: dealRes.products ? dealRes.products.map(p => p._id) : [],
                bgImage_url: dealRes.bgImage_url || null,
                icon_url: dealRes.icon_url || null
            });
            if (dealRes.bgImage_url) {
                setBgImagePreview(dealRes.bgImage_url);
            }
            if (dealRes.icon_url) {
                setIconPreview(dealRes.icon_url);
            }
            setRemoveBgImage(false);
            setRemoveIcon(false);
            setAllProducts(productsRes.products || productsRes);
        } catch (error) {
            console.error('Error fetching deals:', error);
            alert('Failed to load deals data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', dealData.name);
            formData.append('offerPercentage', dealData.offerPercentage);
            formData.append('products', JSON.stringify(dealData.products));
            if (bgImageFile) {
                formData.append('bgImage', bgImageFile);
            }
            if (iconFile) {
                formData.append('icon', iconFile);
            }
            if (removeBgImage) formData.append('removeBgImage', 'true');
            if (removeIcon) formData.append('removeIcon', 'true');

            // api.put now automatically handles FormData correctly by omitting Content-Type
            await api.put('/api/deals', formData);
            alert('Deals updated successfully');
        } catch (error) {
            console.error('Error saving deals:', error);
            alert('Failed to save deals');
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBgImageFile(file);
            setBgImagePreview(URL.createObjectURL(file));
            setRemoveBgImage(false);
        }
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
            setRemoveIcon(false);
        }
    };

    const toggleProduct = (productId) => {
        setDealData(prev => {
            const isSelected = prev.products.includes(productId);
            if (isSelected) {
                return { ...prev, products: prev.products.filter(id => id !== productId) };
            } else {
                return { ...prev, products: [...prev.products, productId] };
            }
        });
    };

    const filteredProducts = (Array.isArray(allProducts) ? allProducts : (allProducts.products || [])).filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-5xl mx-auto my-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-3 rounded-lg">
                    <Tag className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Deals Management</h1>
                    <p className="text-gray-500 text-sm">Manage the deals section on the homepage</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deal Section Header Name</label>
                    <input
                        type="text"
                        className="w-full border-gray-300 rounded-lg p-3 border focus:ring-amber-500 focus:border-amber-500"
                        value={dealData.name}
                        onChange={(e) => setDealData({ ...dealData, name: e.target.value })}
                        placeholder="e.g. Special Summer Offers"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Percentage (Up to %)</label>
                    <input
                        type="number"
                        className="w-full border-gray-300 rounded-lg p-3 border focus:ring-amber-500 focus:border-amber-500"
                        value={dealData.offerPercentage}
                        onChange={(e) => setDealData({ ...dealData, offerPercentage: Number(e.target.value) })}
                        placeholder="e.g. 50"
                    />
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Section Background Image</label>
                <div className="flex items-center gap-4">
                    {bgImagePreview && (
                        <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                            <img src={bgImagePreview} alt="Background Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <span>{bgImagePreview ? 'Change Image' : 'Upload Image'}</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                    {bgImagePreview && (
                        <button
                            type="button"
                            onClick={() => {
                                setBgImageFile(null);
                                setBgImagePreview(null);
                                setRemoveBgImage(true);
                            }}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Remove
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload a wide image to be used as the background of the deals section on the homepage.</p>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Section Custom Icon</label>
                <div className="flex items-center gap-4">
                    {iconPreview ? (
                        <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 flex items-center justify-center bg-amber-50">
                            <img src={iconPreview} alt="Icon Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded border border-gray-200 flex items-center justify-center bg-gray-50">
                            <Tag className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                    <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <span>{iconPreview ? 'Change Icon' : 'Upload Icon'}</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleIconChange}
                        />
                    </label>
                    {iconPreview && (
                        <button
                            type="button"
                            onClick={() => {
                                setIconFile(null);
                                setIconPreview(null);
                                setRemoveIcon(true);
                            }}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Remove
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload a small square image or logo (e.g., 64x64) to replace the default tag icon.</p>
            </div>

            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Select Products for Deals</h2>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr
                                key={product._id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => toggleProduct(product._id)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {dealData.products.includes(product._id) ? (
                                        <CheckSquare className="w-5 h-5 text-amber-600" />
                                    ) : (
                                        <Square className="w-5 h-5 text-gray-400" />
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {product.images?.[0] && (
                                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                                        )}
                                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{product.price}
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Deals Section'}
                </button>
            </div>
        </div>
    );
};

export default DealsManagement;
