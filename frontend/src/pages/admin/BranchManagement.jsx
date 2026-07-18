import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BranchManagement = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        googleMapsLink: '',
        instagramLink: '',
        isActive: true
    });
    const [editingId, setEditingId] = useState(null);
    const { user } = useAuth();

    const fetchBranches = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/branches/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBranches(data);
            }
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/branches${editingId ? `/${editingId}` : ''}`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchBranches();
                closeModal();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to save branch');
            }
        } catch (error) {
            console.error('Failed to save branch:', error);
            alert('Failed to save branch');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/branches/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    fetchBranches();
                }
            } catch (error) {
                console.error('Failed to delete branch:', error);
            }
        }
    };

    const openModal = (branch = null) => {
        if (branch) {
            setEditingId(branch._id);
            setFormData({
                name: branch.name,
                address: branch.address,
                googleMapsLink: branch.googleMapsLink,
                instagramLink: branch.instagramLink || '',
                isActive: branch.isActive
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                address: '',
                googleMapsLink: '',
                instagramLink: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900">Branch Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage physical store locations and branch details.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2 px-4 py-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Branch</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 animate-pulse">Loading branches...</div>
                ) : branches.length === 0 ? (
                    <div className="p-12 text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No branches found</h3>
                        <p className="text-gray-500 mb-6 text-sm">Add your first branch to display it on the About Us page.</p>
                        <button onClick={() => openModal()} className="btn-primary inline-flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Branch
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-bold rounded-tl-2xl w-1/4">Name</th>
                                    <th className="px-6 py-4 font-bold w-1/3">Address</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right rounded-tr-2xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.map((branch) => (
                                    <tr key={branch._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{branch.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">{branch.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${branch.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {branch.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {branch.googleMapsLink && (
                                                    <a
                                                        href={branch.googleMapsLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors bg-gray-50 hover:bg-blue-50 rounded-xl"
                                                        title="View on Maps"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => openModal(branch)}
                                                    className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors bg-gray-50 hover:bg-purple-50 rounded-xl"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(branch._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-xl"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-display font-bold text-gray-900">
                                {editingId ? 'Edit Branch' : 'Add New Branch'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 transition-colors text-xl font-light">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                                    Branch Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                    placeholder="e.g. Achampeta"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                                    Address
                                </label>
                                <textarea
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none resize-none"
                                    placeholder="Full street address..."
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                                    Google Maps Link
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={formData.googleMapsLink}
                                    onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">
                                    Instagram Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.instagramLink}
                                    onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                    Branch is currently active
                                </label>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#8E447E] text-white font-bold text-sm rounded-xl hover:bg-[#7A3B6D] transition-colors"
                                >
                                    {editingId ? 'Save Changes' : 'Add Branch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagement;
