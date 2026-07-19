import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Special Offers'
    },
    offerPercentage: {
        type: Number,
        required: true,
        default: 0
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    bgImage_url: {
        type: String,
        default: null
    },
    bgImage_public_id: {
        type: String,
        default: null
    },
    icon_url: {
        type: String,
        default: null
    },
    icon_public_id: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Deal = mongoose.model('Deal', dealSchema);
export default Deal;
