import { useState, useEffect } from 'react';
import { Package, Upload, Save, X, Trash2, Edit } from 'lucide-react';
import { fullUrl } from '../../lib/utils';

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category_ids: []
    });

    useEffect(() => {
        fetchBrands();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/brands`);
            const data = await response.json();
            if (data.brands) {
                setBrands(data.brands);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (brand) => {
        setEditingItem(brand);
        setFormData({
            name: brand.name || '',
            slug: brand.slug || '',
            category_ids: brand.category_ids || []
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({
            name: '',
            slug: '',
            category_ids: []
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this brand?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/brands/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setBrands(brands.filter(c => c.id !== id));
                alert('Brand deleted successfully');
            } else {
                alert('Failed to delete brand');
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
            alert('Error deleting brand');
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.category_ids.length === 0) {
            alert('Please select at least one category.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const submitData = new FormData();

            submitData.append('name', formData.name);
            submitData.append('slug', formData.slug);
            if (formData.category_ids && formData.category_ids.length > 0) {
                submitData.append('category_ids', JSON.stringify(formData.category_ids));
            }



            const url = editingItem
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/brands/${editingItem.id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/brands`;

            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Brand ${editingItem ? 'updated' : 'created'} successfully!`);
                setShowModal(false);
                setEditingItem(null);
                fetchBrands();
            } else {
                alert(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving brand:', error);
            alert('Failed to save brand');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
                    <p className="text-gray-600 mt-1">Manage shop brands</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2"
                >
                    <Package className="w-5 h-5" />
                    Add Brand
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {brands.map((brand) => (
                    <div key={brand.id} className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow p-6 relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => handleEdit(brand)}
                                className="p-2 bg-gray-50 rounded-full hover:bg-orange-500 hover:text-white transition-colors"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(brand.id)}
                                className="p-2 bg-gray-50 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{brand.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Found in: {brand.category_names?.join(', ') || 'Uncategorized'}</p>
                                <p className="text-xs text-gray-400 font-mono mt-1">{brand.slug}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">{editingItem ? 'Edit Brand' : 'Add Brand'}</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Brand Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categories <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                        {categories.map((cat) => {
                                            const catId = cat.id || cat._id;
                                            return (
                                                <label key={catId} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                                        checked={formData.category_ids.includes(catId)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, category_ids: [...formData.category_ids, catId] });
                                                            } else {
                                                                setFormData({ ...formData, category_ids: formData.category_ids.filter(id => id !== catId) });
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-700">{cat.name}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                    {formData.category_ids.length === 0 && (
                                        <p className="text-red-500 text-xs mt-1">Please select at least one category.</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Slug (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="Auto-generated if empty"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Brand
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandManagement;
