import express from 'express';
import Brand from '../models/Brand.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = express.Router();

// Get all brands (public)
router.get('/', cacheMiddleware(300), async (req, res) => {
    try {
        const { category_id } = req.query;
        let filter = {};
        if (category_id) {
            filter.category_ids = category_id;
        }
        const brands = await Brand.find(filter).populate('category_ids').sort({ name: 1 }).lean();
        res.json({ brands: brands.map(b => ({ ...b, id: b._id, category_names: b.category_ids?.map(c => c.name) })) });
    } catch (error) {
        console.error('Get brands error:', error);
        res.status(500).json({ error: `Failed to fetch brands: ${error.message}` });
    }
});

// Create brand (admin only)
router.post('/', authenticate, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, slug, category_ids } = req.body;
        let parsedCategoryIds = [];
        try {
            parsedCategoryIds = typeof category_ids === 'string' ? JSON.parse(category_ids) : category_ids;
        } catch {
            parsedCategoryIds = category_ids || [];
        }

        let image_url = null;
        let image_public_id = null;

        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file, 'brand');
            image_url = uploadResult.url;
            image_public_id = uploadResult.publicId;
        }

        const brand = await Brand.create({
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            category_ids: parsedCategoryIds,
            image_url,
            image_public_id,
        });

        invalidateCache((key) => key.startsWith('/api/brands'));
        res.status(201).json({ message: 'Brand created successfully', brand });
    } catch (error) {
        console.error('Create brand error:', error);
        res.status(500).json({ error: `Failed to create brand: ${error.message}` });
    }
});

// Update brand (admin only)
router.put('/:id', authenticate, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, category_ids } = req.body;

        const existing = await Brand.findById(id);
        if (!existing) return res.status(404).json({ error: 'Brand not found' });

        const updates = {
            name: name || existing.name,
            slug: slug || existing.slug,
        };

        if (category_ids) {
            let parsedCategoryIds = [];
            try {
                parsedCategoryIds = typeof category_ids === 'string' ? JSON.parse(category_ids) : category_ids;
            } catch {
                parsedCategoryIds = category_ids || [];
            }
            updates.category_ids = parsedCategoryIds;
        }

        if (req.file) {
            if (existing.image_public_id) {
                try { await deleteFromCloudinary(existing.image_public_id); } catch (e) { }
            }
            const uploadResult = await uploadToCloudinary(req.file, 'brand');
            updates.image_url = uploadResult.url;
            updates.image_public_id = uploadResult.publicId;
        }

        const brand = await Brand.findByIdAndUpdate(id, updates, { new: true });
        invalidateCache((key) => key.startsWith('/api/brands'));
        res.json({ message: 'Brand updated successfully', brand });
    } catch (error) {
        console.error('Update brand error:', error);
        res.status(500).json({ error: `Failed to update brand: ${error.message}` });
    }
});

// Delete brand (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findById(id);
        if (brand?.image_public_id) {
            try { await deleteFromCloudinary(brand.image_public_id); } catch (e) { }
        }
        await Brand.findByIdAndDelete(id);
        invalidateCache((key) => key.startsWith('/api/brands'));
        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error('Delete brand error:', error);
        res.status(500).json({ error: `Failed to delete brand: ${error.message}` });
    }
});

export default router;
