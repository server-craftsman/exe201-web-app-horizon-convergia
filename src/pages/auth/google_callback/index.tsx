import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../../services/auth/auth.service';
import { useLocalStorage } from '../../../hooks';
import { helpers } from '../../../utils';
import { ROUTER_URL } from '../../../consts/router.path.const';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Gọi API để xử lý callback từ Google
        const response = await AuthService.googleCallback();
        
        if (response?.data?.data) {
          const userData = response.data.data;
          
          // Lưu token và user info
          setItem("accessToken", userData.accessToken);
          setItem("role", userData.role);
          setItem("userInfo", JSON.stringify(userData));
          
          helpers.notificationMessage("Đăng nhập Google thành công!", "success");
          
          // Redirect về trang chính
          navigate(ROUTER_URL.COMMON.HOME);
        }
      } catch (error) {
        console.error('Google callback error:', error);
        helpers.notificationMessage("Lỗi đăng nhập Google", "error");
        navigate(ROUTER_URL.AUTH.LOGIN);
      }
    };

    handleGoogleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang xử lý đăng nhập Google...</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;