import { useState } from 'react';
import { motion } from 'framer-motion';
import { DisplayUserProfileComponent } from '../../../components/auth/settings/DisplayUserProfile.com';
import ChangePasswordComponent from '../../../components/auth/settings/ChangePassword.com';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Hồ sơ người dùng', icon:
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
    },
    { id: 'password', label: 'Thay đổi mật khẩu', icon:
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
    },
  ];

  return (
      <div className="w-full min-h-screen">
        <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-amber-400 mb-8 text-center"
        >
            Cài đặt tài khoản
        </motion.h1>
        <div className="max-w-[1200px] mx-auto bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="border-b border-amber-200">
            <nav className="flex" aria-label="Tabs">
              {tabs.map((tab) => (
                  <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      // whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${
                          activeTab === tab.id
                              ? 'border-amber-500 text-amber-400'
                              : 'border-transparent text-gray-500 hover:text-amber-500 hover:border-amber-300'
                      } flex-1 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-lg transition-colors duration-200 focus:outline-none`}
                  >
                    <div className="flex items-center justify-center mr-2">
                      {tab.icon}
                      <span className="ml-1">{tab.label}</span>
                    </div>
                  </motion.button>
              ))}
            </nav>
          </div>
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-6"
          >
            {activeTab === 'profile' && <DisplayUserProfileComponent />}
            {activeTab === 'password' && <ChangePasswordComponent />}
          </motion.div>
        </div>
      </div>
  );
};

export default SettingsPage;