import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@hooks/modules/useAuth.ts';
import {useLocalStorage} from "@hooks/other/useLocalStorage.ts";

const ChangePasswordComponent = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    // const [success, setSuccess] = useState<string | null>(null);
    const { changePassword, logout } = useAuth();
    const { getItem } = useLocalStorage();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        // setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        try {
            const userId = getItem("userId");
            if (!userId) {
                setError("Không tìm thấy ID người dùng.");
                return;
            }
            await changePassword.mutateAsync({
                newPassword,
                id: userId,
            });
            // setSuccess('Đổi mật khẩu thành công!');
            setNewPassword('');
            setConfirmPassword('');
            setError(null);
            logout.mutateAsync(); // Đăng xuất sau khi đổi mật khẩu thành công
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response?.data?.message);
            } else {
                setError('Đổi mật khẩu thất bại. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <motion.div className="max-w-2xl mx-auto mt-8 shadow-2xl rounded-lg overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-white shadow-lg rounded-2xl p-8 bg-gradient-to-r from-gray-900 to-gray-800"
            >
                <div className="flex items-center mb-8">
                    <svg className="w-12 h-12 mr-4 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">Thay đổi mật khẩu</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-primary border border-gray-600 bg-gray-800 text-white"
                        />
                        <p className="mt-2 text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`input-primary border ${error && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-600'} bg-gray-800 text-white`}
                        />
                    </div>

                    {error && (
                        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-xl text-base font-bold text-white bg-gradient-to-r from-yellow-500 to-red-500 hover:from-red-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                            disabled={newPassword.length < 6 || newPassword !== confirmPassword}
                        >
                            Thay đổi mật khẩu
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ChangePasswordComponent;