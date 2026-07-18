import { useState } from 'react';
import WhatsAppTemplates from './WhatsAppTemplates';
import WhatsAppCampaigns from './WhatsAppCampaigns';
import SMSCampaigns from './SMSCampaigns';

const CampaignManagement = () => {
    const [activeTab, setActiveTab] = useState('templates');

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
                        <p className="text-gray-600 mt-2">Manage your communication channels and templates</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit">
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'templates'
                            ? 'bg-orange-500 text-white shadow'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        WhatsApp Templates
                    </button>
                    <button
                        onClick={() => setActiveTab('whatsapp')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'whatsapp'
                            ? 'bg-green-600 text-white shadow'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        WhatsApp Campaigns
                    </button>
                    <button
                        onClick={() => setActiveTab('sms')}
                        className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'sms'
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        SMS Campaigns
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[500px]">
                    {activeTab === 'templates' && <WhatsAppTemplates />}
                    {activeTab === 'whatsapp' && <WhatsAppCampaigns />}
                    {activeTab === 'sms' && <SMSCampaigns />}
                </div>
            </div>
        </div>
    );
};

export default CampaignManagement;
