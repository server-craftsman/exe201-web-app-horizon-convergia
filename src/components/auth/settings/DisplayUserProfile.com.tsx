import React, { useState } from 'react';
import { AuthService } from '../../../services/auth/auth.service';

export const DisplayUserProfileComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [userInfo, setUserInfo] = useState(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        return storedUserInfo ? JSON.parse(storedUserInfo) : {};
    });

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleUpdateProfile = async (event: React.FormEvent) => {
        event.preventDefault();
        await AuthService.updateUserInfo(userInfo);
        handleClose();
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">User Profile</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-lg mb-2">Name: {userInfo.name}</p>
                <p className="text-lg mb-2">Email: {userInfo.email}</p>
                <p className="text-lg mb-2">Avatar: <img className="w-24 h-24 rounded-full" src={userInfo.avatarUrl} alt="Avatar" /></p>
                <button onClick={handleShow} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                    Edit Profile
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-1/3">
                        <div className="border-b px-4 py-2 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Edit Profile</h2>
                            <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">&times;</button>
                        </div>
                        <div className="p-4">
                            <form onSubmit={handleUpdateProfile}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Name</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Enter name" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Avatar</label>
                                    <input type="file" className="mt-1 block w-full" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await AuthService.uploadAvatar(file);
                                            setUserInfo({ ...userInfo, avatarUrl: url });
                                        }
                                    }} />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};