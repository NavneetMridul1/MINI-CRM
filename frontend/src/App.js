import React, { useState } from 'react';
import LeadList from './components/leadList';
import FollowUpList from './components/followUp';
import Dashboard from './components/dashboard';

const App = () => {
    const [activeTab, setActiveTab] = useState('leads');

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 px-4">
                <span className="navbar-brand fw-bold">MINI-CRM</span>
                <div className="navbar-nav gap-3">
                    <button className="nav-link btn" onClick={() => setActiveTab('leads')}>Leads</button>
                    <button className="nav-link btn" onClick={() => setActiveTab('followups')}>Follow-ups</button>
                    <button className="nav-link btn" onClick={() => setActiveTab('analytics')}>Analytics</button>
                </div>
            </nav>
            <div className="container">
                {activeTab === 'leads' && <LeadList />}
                {activeTab === 'followups' && <FollowUpList />}
                {activeTab === 'analytics' && <Dashboard />}
            </div>
        </div>
    );
};
export default App;