import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
    image_url: { type: String, default: null },
    image_public_id: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('Brand', brandSchema);
