import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Branch name is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Branch address is required'],
    },
    googleMapsLink: {
        type: String,
        required: [true, 'Google Maps link is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
