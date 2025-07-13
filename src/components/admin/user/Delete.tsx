import { useState } from 'react';

interface DeleteUserProps {
  userId: string;
  onBlock: (id: string) => void;
  disabled?: boolean;
}

export const DeleteUser: React.FC<DeleteUserProps> = ({ userId, onBlock, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
        title="Block"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0L5.636 18.364" />
        </svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500/20 mb-2">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0m12.728 0L5.636 18.364" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Bạn có chắc chắn muốn ẩn người dùng này?</h2>
              <p className="text-gray-400 mb-4">Người dùng sẽ bị block và không thể đăng nhập vào hệ thống.</p>
              <div className="flex gap-3 w-full justify-center">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Huỷ
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:from-red-600 hover:to-red-700 transition-colors"
                  onClick={() => { onBlock(userId); setOpen(false); }}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
