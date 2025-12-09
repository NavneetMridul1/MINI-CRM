import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 
    const [currentLeadId, setCurrentLeadId] = useState(null);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', company: '', assignedTo: '',
        status: 'New',
        followUpDate: '',
        followUpNotes: ''
    });

    const fetchLeads = async () => {
        try {
            const res = await axios.get('/api/leads');
            setLeads(res.data);
        } catch (err) {
            console.error("Error fetching leads:", err);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddClick = () => {
        setIsEditing(false);
        setFormData({ name: '', email: '', phone: '', company: '', assignedTo: '', status: 'New', followUpDate: '', followUpNotes: '' });
        setShowModal(true);
    };

    const handleEditClick = (lead) => {
        setIsEditing(true);
        setCurrentLeadId(lead._id);
   
        setFormData({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company || '',
            assignedTo: lead.assignedTo || '',
            status: lead.status,
            followUpDate: '',
            followUpNotes: ''
        });
        setShowModal(true);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                
                await axios.put(`/api/leads/${currentLeadId}`, formData);
            } else {
                
                await axios.post('/api/leads', {
                    ...formData,
                    status: 'New'
                });
            }
            setShowModal(false);
            fetchLeads(); 
        } catch (err) {
            console.error("Error saving lead:", err);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'New': return 'bg-primary';
            case 'Contacted': return 'bg-warning text-dark';
            case 'Converted': return 'bg-success';
            case 'Lost': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div >
            <div >
                <h2>Leads</h2>
                <button onClick={handleAddClick}>
                    + Add Lead
                </button>
            </div>

            <div className="bg-white">
                {leads.map((lead) => (
                    <div key={lead._id} className="p-4 border-bottom d-flex justify-content-between align-items-center">
                        
                        <div>
                            <h5 >{lead.name}</h5>
                            <div>
                                <span ><span >Email:</span> {lead.email}</span>
                                <span className="d-flex gap-1"><span>Ph:</span> {lead.phone}</span>
                                {lead.company && <span className="gap-1"><span>Company:</span> {lead.company}</span>}
                                <div >Assigned To: <span >{lead.assignedTo || 'Unassigned'}</span></div>
                            </div>
                        </div>

                        <div className="text-end">
                            <span className={`badge rounded-pill px-3 py-2 mb-1 ${getStatusBadge(lead.status)}`}>{lead.status}</span>

                            <div>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEditClick(lead)}>
                                Update
                            </button>
                            </div>
                        </div>
                    </div>
                ))}
                {leads.length === 0 && <div>No leads found.</div>}
            </div>

            {showModal && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Edit Lead & Follow-up' : 'Add New Lead'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={onSubmit}>
                            
                                    <div>
                                        <div >
                                            <label >Name</label>
                                            <input type="text" className="form-control" name="name" value={formData.name} onChange={onChange} required />
                                        </div>
                                        <div >
                                            <label >Phone</label>
                                            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={onChange} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label >Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={onChange} required />
                                    </div>
                                    <div className="row">
                                        <div >
                                            <label >Company</label>
                                            <input type="text" className="form-control" name="company" value={formData.company} onChange={onChange} />
                                        </div>
                                        <div >
                                            <label >Assigned To</label>
                                            <input type="text" className="form-control" name="assignedTo" value={formData.assignedTo} onChange={onChange} />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="mt-4">
                                            <h6 >Update Status & Schedule</h6>

                                            <div >
                                                <label >Current Status</label>
                                                <select name="status" value={formData.status} onChange={onChange}>
                                                    <option>New</option>
                                                    <option>Contacted</option>
                                                    <option>Converted</option>
                                                    <option>Lost</option>
                                                </select>
                                            </div>

                                            <hr />

                                            <label>Schedule New Follow-up</label>
                                            <div >
                                                <div className="mb-2">
                                                    <input type="date" name="followUpDate" value={formData.followUpDate} onChange={onChange} />
                                                </div>
                                                <div className="mb-2">
                                                    <input type="text" name="followUpNotes" value={formData.followUpNotes} placeholder="Note (e.g. Call back)" onChange={onChange} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">{isEditing ? 'Update Lead' : 'Save Lead'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadList;