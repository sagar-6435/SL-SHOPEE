import express from 'express';
import Branch from '../models/Branch.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
router.get('/', async (req, res) => {
    try {
        const count = await Branch.countDocuments();
        if (count === 0) {
            const defaultBranches = [
                { name: 'Achampeta', address: 'Achampeta Main Road', googleMapsLink: 'https://maps.google.com' },
                { name: 'Peddapuram', address: 'Peddapuram Center', googleMapsLink: 'https://maps.google.com' },
                { name: 'Pitapuram', address: 'Pitapuram Market', googleMapsLink: 'https://maps.google.com' },
                { name: 'Gollaprolu', address: 'Gollaprolu High School Road', googleMapsLink: 'https://maps.google.com' },
                { name: 'Kathipudi', address: 'Kathipudi Junction', googleMapsLink: 'https://maps.google.com' }
            ];
            await Branch.insertMany(defaultBranches);
        }
        const branches = await Branch.find({ isActive: true }).sort({ createdAt: 1 });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch branches', error: error.message });
    }
});

// @desc    Get all branches (Admin)
// @route   GET /api/branches/admin
// @access  Private/Admin
router.get('/admin', authenticate, isAdmin, async (req, res) => {
    try {
        const branches = await Branch.find({}).sort({ createdAt: 1 });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch branches', error: error.message });
    }
});

// @desc    Create a branch
// @route   POST /api/branches
// @access  Private/Admin
router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, address, googleMapsLink, instagramLink, isActive } = req.body;
        const branch = new Branch({ name, address, googleMapsLink, instagramLink, isActive });
        const createdBranch = await branch.save();
        res.status(201).json(createdBranch);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create branch', error: error.message });
    }
});

// @desc    Update a branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, address, googleMapsLink, instagramLink, isActive } = req.body;
        const branch = await Branch.findById(req.params.id);

        if (branch) {
            branch.name = name || branch.name;
            branch.address = address || branch.address;
            branch.googleMapsLink = googleMapsLink || branch.googleMapsLink;
            if (instagramLink !== undefined) branch.instagramLink = instagramLink;
            if (isActive !== undefined) branch.isActive = isActive;

            const updatedBranch = await branch.save();
            res.json(updatedBranch);
        } else {
            res.status(404).json({ message: 'Branch not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Failed to update branch', error: error.message });
    }
});

// @desc    Delete a branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (branch) {
            await branch.deleteOne();
            res.json({ message: 'Branch removed' });
        } else {
            res.status(404).json({ message: 'Branch not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete branch', error: error.message });
    }
});

export default router;
