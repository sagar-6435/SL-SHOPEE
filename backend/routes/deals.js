import express from 'express';
import { authenticate as protect, isAdmin as admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import Deal from '../models/Deal.js';

const router = express.Router();

// GET /api/deals
// Public
router.get('/', async (req, res) => {
    try {
        let deal = await Deal.findOne().populate('products');
        if (!deal) {
            deal = await Deal.create({ name: 'Special Offers', offerPercentage: 0, products: [] });
            deal = await Deal.findOne().populate('products');
        }
        res.json(deal);
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/deals
// Admin only
router.put('/', protect, admin, upload.fields([{ name: 'bgImage', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), async (req, res) => {
    try {
        const { name, offerPercentage, products } = req.body;
        let deal = await Deal.findOne();
        if (!deal) {
            deal = new Deal();
        }
        if (name !== undefined) deal.name = name;
        if (offerPercentage !== undefined) deal.offerPercentage = offerPercentage;

        if (products !== undefined) {
            try {
                deal.products = typeof products === 'string' ? JSON.parse(products) : products;
            } catch (e) {
                deal.products = products || [];
            }
        }

        if (req.files) {
            if (req.files.bgImage && req.files.bgImage[0]) {
                if (deal.bgImage_public_id) {
                    try {
                        await deleteFromCloudinary(deal.bgImage_public_id);
                    } catch (e) {
                        console.error('Failed to delete old deal bg:', e);
                    }
                }
                const uploadResult = await uploadToCloudinary(req.files.bgImage[0], 'deals');
                deal.bgImage_url = uploadResult.url;
                deal.bgImage_public_id = uploadResult.publicId;
            }

            if (req.files.icon && req.files.icon[0]) {
                if (deal.icon_public_id) {
                    try {
                        await deleteFromCloudinary(deal.icon_public_id);
                    } catch (e) {
                        console.error('Failed to delete old deal icon:', e);
                    }
                }
                const uploadResult = await uploadToCloudinary(req.files.icon[0], 'deals');
                deal.icon_url = uploadResult.url;
                deal.icon_public_id = uploadResult.publicId;
            }
        }

        await deal.save();

        await deal.populate('products');
        res.json(deal);
    } catch (error) {
        console.error('Error updating deals:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
