const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true},
    status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Lost'], default: 'New' },
    assignedTo: { type: String, default: 'Unassigned' },
    createdAt: { type: Date, default: Date.now },
    followUps: [{
        date: Date,
        notes: String,
        isCompleted: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('Lead', LeadSchema);