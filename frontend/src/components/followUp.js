import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowUpList = () => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
        
            const res = await axios.get('/api/leads');
            
            const allTasks = [];
            res.data.forEach(lead => {
                if (lead.followUps && lead.followUps.length > 0) {
                    lead.followUps.forEach(task => {
                        
                        if (task.isCompleted === false) { 
                            allTasks.push({
                                ...task,
                                leadName: lead.name,
                                leadId: lead._id,
                                leadCompany: lead.company
                            });
                        }
                    });
                }
            });

            allTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
            setTasks(allTasks);

        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const markAsDone = async (leadId, followUpId) => {

        const previousTasks = [...tasks];
        setTasks(tasks.filter(t => t._id !== followUpId));

        try {
            await axios.put('/api/leads/mark-complete', { 
                leadId, 
                followUpId 
            });
            
        } catch (err) {
            console.error("Error marking task:", err);

            setTasks(previousTasks);
            alert("Something went wrong.");
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div >
            <h2 >Pending Follow-ups</h2>
            
            <div>
                <div>
                    {tasks.length === 0 ? (
                        <div >
                            <p>No pending follow-ups scheduled</p>
                        </div>
                    ) : (
                        <div className="bg-white">
                            {tasks.map((task) => (
                                <div key={task._id} className="p-4 border-bottom d-flex justify-content-between align-items-center">
                                    <div>
                                        <div >
                                            <span>
                                                Due: {formatDate(task.date)}
                                            </span>
                                            <h5>{task.leadName}</h5>
                                        </div>
                                        <p>Note: {task.notes}</p>
                                        <small className="text-muted">Company: {task.leadCompany || 'N/A'}</small>
                                    </div>
                                    <div>
                                        <button 
                                            className="btn btn-success btn-sm"
                                            onClick={() => markAsDone(task.leadId, task._id)}
                                        >
                                            Mark Complete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowUpList;