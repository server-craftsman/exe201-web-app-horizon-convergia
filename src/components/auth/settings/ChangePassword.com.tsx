import React, { useState } from 'react';

const ChangePasswordComponent = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError("New passwords don't match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (apiError: any) {
            setError(apiError.message || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-4 bg-white shadow-lg rounded-lg">
            <div className="p-8">
                <div className="flex items-center mb-6">
                    <svg className="w-10 h-10 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-2 text-xs text-gray-500">Password must be at least 6 characters.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${error && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>

                    {error && (
                        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                            {success}
                        </div>
                    )}

                    <div className="relative">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordComponent;