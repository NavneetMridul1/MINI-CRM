import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        convertedCount: 0,
        conversionRate: 0,
        byAgent: {},  
        byMonth: {}      
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const res = await axios.get('/api/leads');
                const leads = res.data;

                const total = leads.length;
                const converted = leads.filter(l => l.status === 'Converted').length;
                const rate = total === 0 ? 0 : Math.round((converted / total) * 100);

                const agentMap = {};
                leads.forEach(lead => {
                    const agent = lead.assignedTo || 'Unassigned';
                    agentMap[agent] = (agentMap[agent] || 0) + 1;
                });

                const monthMap = {};
                leads.forEach(lead => {
                    const date = new Date(lead.createdAt);
                    const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    
                    if (!monthMap[monthKey]) {
                        monthMap[monthKey] = { total: 0, converted: 0 };
                    }
                    monthMap[monthKey].total += 1;
                    if (lead.status === 'Converted') {
                        monthMap[monthKey].converted += 1;
                    }
                });

                setStats({
                    totalLeads: total,
                    convertedCount: converted,
                    conversionRate: rate,
                    byAgent: agentMap,
                    byMonth: monthMap
                });
                setLoading(false);

            } catch (err) {
                console.error("Error fetching analytics:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div>
            <h2>Analytics Dashboard</h2>

            <div className="row g-4 mb-5">
                
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <p>Total Leads</p>
                            <h3>{stats.totalLeads}</h3>
                        </div>
                    </div>
                </div>

    {/* --------------------------------------------------------------------------------------------------- */}

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <p>Conversion Rate</p>
                            <h3>{stats.conversionRate}%</h3>
                            <small>{stats.convertedCount} leads converted</small>
                        </div>
                    </div>
                </div>

    {/* --------------------------------------------------------------------------------------------------- */}
               
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <p>Active Pipeline</p>
                            <h3>
                                {stats.totalLeads - stats.convertedCount}
                            </h3>
                            <small>In progress (New/Contacted)</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header">Total Leads per User</div>
                        <div className="card-body">
                            {Object.keys(stats.byAgent).length === 0 ? (
                                <p>No data available.</p>
                            ) : (
                                Object.entries(stats.byAgent).map(([agent, count]) => (
                                    <div key={agent} className="mb-3">
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span>{agent}</span>
                                            <span>{count} leads</span>
                                        </div>
                                        <div className="progress">
                                            <div 
                                                className="progress-bar" 
                                                role="progressbar" 
                                                style={{ width: `${(count / stats.totalLeads) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

    {/* --------------------------------------------------------------------------------------------------- */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header">Monthly Performance</div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>New Leads</th>
                                            <th>Converted</th>
                                            <th>Conversion Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(stats.byMonth).length === 0 ? (
                                            <tr><td colSpan="4">No history yet.</td></tr>
                                        ) : (
                                            Object.entries(stats.byMonth).map(([month, data]) => (
                                                <tr key={month}>
                                                    <td>{month}</td>
                                                    <td>{data.total}</td>
                                                    <td>{data.converted}</td>
                                                    <td>
                                                        {data.total === 0 ? '0%' : Math.round((data.converted / data.total) * 100) + '%'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;