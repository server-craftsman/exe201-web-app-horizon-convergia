import React from 'react';

const FooterLayout: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Thông tin công ty */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-amber-400 tracking-wide">HORIZON CONVERGIA</h3>
            <div className="mb-5 space-y-2">
              <p className="font-semibold text-gray-100">TRỤ SỞ CHÍNH</p>
              <p className="text-sm">Số 2, đường Hoàng Hữu Nam, Phường Long Thạnh, Quận 9, TP Thủ Đức, TP Hồ Chí Minh</p>
              <p className="text-sm">Điện thoại:</p>
              <p className="text-amber-400 font-medium">0869872830</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-100">CHI NHÁNH CỦ CHI</p>
              <p className="text-sm">174/13A đường Giồng Cát, tổ 8, Láng Cát, Xã Tân Phú Trung, Củ Chi, TP HCM</p>
              <p className="text-sm">Điện thoại:</p>
              <p className="text-amber-400 font-medium">0968778992 - 0979744454</p>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-amber-400 tracking-wide">HỖ TRỢ KHÁCH HÀNG</h3>
            <div className="mb-5 space-y-2">
              <p className="text-sm">Hotline: <span className="text-amber-400 font-medium">1900 636 135</span></p>
              <p className="text-xs text-gray-400">(8:00 - 21:00)</p>
              <p className="text-sm">Email: chuahoangphaptrunguongfake@gmail.com</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm hover:text-amber-400 cursor-pointer transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                Chính sách giải quyết khiếu nại
              </p>
              <p className="text-sm hover:text-amber-400 cursor-pointer transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                Chính sách bảo mật
              </p>
              <p className="text-sm hover:text-amber-400 cursor-pointer transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                Quy định đăng tin
              </p>
              <p className="text-sm hover:text-amber-400 cursor-pointer transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                Quy chế hoạt động
              </p>
            </div>
          </div>

          {/* Về chúng tôi */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-amber-400 tracking-wide">VỀ CHÚNG TÔI</h3>
            <div className="space-y-3 mb-6">
              <p className="text-sm hover:text-amber-400 cursor-pointer transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                Giới thiệu
              </p>
              <p className="text-sm hover:text-amber-400 cursor-pointer transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                Điều khoản sử dụng
              </p>
              <p className="text-sm hover:text-amber-400 cursor-pointer transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                Trung tâm khách hàng
              </p>
              <p className="text-sm hover:text-amber-400 cursor-pointer transition-colors duration-300 flex items-center">
                <span className="w-1 h-1 bg-amber-400 rounded-full mr-2"></span>
                Hỏi đáp (FAQ)
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-100">TẢI ỨNG DỤNG TẠI ĐÂY:</h4>
              <div className="flex space-x-4">
                <a href="#" className="block bg-black p-2 rounded-lg border border-gray-700 hover:border-amber-400 transition-colors duration-300">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <svg className="w-6 h-6 text-gray-100" fill="currentColor" viewBox="0 0 20 24">
                        <path d="M13.623 10.627c-.025-2.533 2.066-3.748 2.162-3.808-1.178-1.723-3.018-1.958-3.672-1.986-1.559-.157-3.059.925-3.85.925-.798 0-2.016-.906-3.32-.881-1.707.025-3.285.994-4.166 2.526-1.782 3.082-.454 7.639 1.276 10.14.847 1.223 1.854 2.596 3.176 2.546 1.278-.052 1.76-.824 3.305-.824 1.538 0 1.982.824 3.33.795 1.377-.023 2.247-1.249 3.087-2.477.974-1.413 1.372-2.787 1.392-2.859-.03-.011-2.664-1.022-2.692-4.056l-.028-.041zM11.262 3.19c.7-.854 1.172-2.033 1.043-3.217-1.008.043-2.234.674-2.955 1.516-.647.754-1.216 1.963-1.063 3.119 1.126.087 2.277-.571 2.975-1.418z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Download on the</div>
                      <div className="text-sm font-medium text-gray-100">App Store</div>
                    </div>
                  </div>
                </a>
                <a href="#" className="block bg-black p-2 rounded-lg border border-gray-700 hover:border-amber-400 transition-colors duration-300">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <svg className="w-6 h-6 text-gray-100" fill="currentColor" viewBox="0 0 22 24">
                        <path d="M17.5234 8.62305C13.5234 6.47266 7.1875 10.2969 7.1875 10.2969L3.54297 13.3594C3.54297 13.3594 2.76172 13.9688 2.67578 14.5C2.58984 15.0312 3.19922 15.5859 3.19922 15.5859L6.70703 18.5078C6.70703 18.5078 7.21875 19.0859 7.83984 18.9844C8.46094 18.8828 9.1875 18.1797 9.1875 18.1797L10.8516 16.2422C10.8516 16.2422 11.5781 15.5625 12.6094 16.2422C13.6406 16.9219 17.6484 20.0078 17.6484 20.0078C17.6484 20.0078 18.3984 20.5312 18.8672 20.1328C19.3359 19.7344 22 15.3203 22 15.3203C22 15.3203 22.0078 14.6328 21.2891 14.1484C20.9813 13.9361 20.6529 13.7584 20.3086 13.6172L13.2422 9.94531C13.2422 9.94531 12.4688 9.57031 11.8867 9.57031C11.3047 9.57031 10.8828 9.80078 10.8828 9.80078L7.57812 11.8125C7.57812 11.8125 6.89062 12.2344 6.57422 12.2344C6.25781 12.2344 5.96094 11.9062 5.96094 11.9062L3.77734 10.1172C3.77734 10.1172 3.4375 9.82031 3.4375 9.5C3.4375 9.17969 3.67578 8.99219 3.67578 8.99219L6.64062 7.13281C6.64062 7.13281 13.1016 3.76562 16.4062 3.76562C19.7109 3.76562 21.375 5.17578 21.375 7.60156C21.375 10.0273 17.5234 8.62305 17.5234 8.62305Z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Get it on</div>
                      <div className="text-sm font-medium text-gray-100">Google Play</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          <p className="mb-2">© 2023 Horizon Convergia. Tất cả các quyền được bảo lưu.</p>
          <p className="text-amber-500/70">Điểm đến tin cậy của những người yêu xe máy</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;
