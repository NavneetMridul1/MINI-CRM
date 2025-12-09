require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Lead = require('./models/lead');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();


// ============================================================
app.get('/api/leads', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ============================================================
app.post('/api/leads', async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();
        res.json(savedLead);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ============================================================
app.put('/api/leads/mark-complete', async (req, res) => {
    const { leadId, followUpId } = req.body;
    try {
        const lead = await Lead.findById(leadId);
        if (!lead) return res.status(404).json({ error: "Lead not found" });

        const task = lead.followUps.id(followUpId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.isCompleted = true;
        await lead.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ============================================================
app.put('/api/leads/:id', async (req, res) => {
    try {
        const { followUpDate, followUpNotes, ...updateData } = req.body;
        
        let lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (followUpDate && followUpNotes) {
          
            lead.followUps.push({ 
                date: new Date(followUpDate), 
                notes: followUpNotes,
                isCompleted: false
            });
            await lead.save();
        }
        
        res.json(lead);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;