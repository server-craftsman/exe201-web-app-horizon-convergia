import React, { useState } from 'react';
import { DisplayUserProfileComponent } from '../../../components/auth/settings/DisplayUserProfile.com';
import ChangePasswordComponent from '../../../components/auth/settings/ChangePassword.com';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'password', label: 'Change Password' },
  ];

  return (
    <div className="w-full mt-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-2">Account Settings</h1>
      <div className="bg-white shadow-md rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 focus:outline-none`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 md:p-8">
          {activeTab === 'profile' && <DisplayUserProfileComponent />}
          {activeTab === 'password' && <ChangePasswordComponent />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;