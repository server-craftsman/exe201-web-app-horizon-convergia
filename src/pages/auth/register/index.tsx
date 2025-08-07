import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTER_URL } from '../../../consts/router.path.const';
import { useVietnamAddress, useUser } from '../../../hooks';
// import { useBank } from '../../../hooks/other/useBank'; // Commented out - not needed for basic register
import { helpers } from '../../../utils';
import { Gender, UserRoleInteger } from "../../../app/enums";
// import CourseraEditor from '../../../components/common/CourseraEditor'; // Commented out - not needed for basic register
// import Select from 'react-select'; // Commented out - not needed for basic register

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: 0,
    password: '',
    confirmPassword: '',
    streetAddress: '',
    gender: Gender.MALE,
    dob: '',
    role: UserRoleInteger.BUYER,
    // shopName: '', // Commented out - not in API
    // shopDescription: '', // Commented out - not in API
    // businessType: '', // Commented out - not in API
    agreeTerms: false,
    provinceCode: '',
    districtCode: '',
    wardCode: '',
    // bankName: '', // Commented out - not in API
    // bankAccountNumber: '', // Commented out - not in API
    // bankAccountHolder: '', // Commented out - not in API
  });

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [dobError, setDobError] = useState('');

  const { register } = useUser();
  const { provinces, getDistricts, getWards, formatAddress } = useVietnamAddress();
  // const { banks, isLoading: isLoadingBanks } = useBank(); // Commented out - not needed for basic register
  const districts = getDistricts(formData.provinceCode);
  const wards = getWards(formData.districtCode);

  // Handle successful registration
  useEffect(() => {
    if (register.isSuccess) {
      helpers.notificationMessage("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...", "success");
      setTimeout(() => {
        navigate(ROUTER_URL.AUTH.LOGIN);
      }, 1500);
    }
  }, [register.isSuccess, navigate]);

  // Password strength checker
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  // Update full address when address components change
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard && formData.streetAddress) {
      const address = formatAddress(
        formData.streetAddress,
        selectedWard,
        selectedDistrict,
        selectedProvince
      );
      setFullAddress(address);
    }
  }, [selectedProvince, selectedDistrict, selectedWard, formData.streetAddress, formatAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    console.log('HandleChange called:', { name, value, type, checked }); // Debug log

    // Handle role selection specifically
    if (name === 'role') {
      const roleValue = parseInt(value, 10);
      console.log('Role selected:', roleValue); // Debug log
      setFormData({
        ...formData,
        [name]: roleValue
      });
      return;
    }

    // Handle DOB validation
    if (name === 'dob') {
      const selectedDate = new Date(value);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 100);

      if (selectedDate > today) {
        setDobError('Ngày sinh không được là ngày trong tương lai');
        setFormData({
          ...formData,
          [name]: value
        });
        return;
      } else if (selectedDate < minDate) {
        setDobError('Ngày sinh không được quá 100 năm trước');
        setFormData({
          ...formData,
          [name]: value
        });
        return;
      } else {
        setDobError('');
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Handle address selections
    if (name === 'provinceCode') {
      const selectedProvinceName = provinces.data?.find((p: { code: string; }) => p.code === value)?.name || '';
      setSelectedProvince(selectedProvinceName);
      setFormData(prev => ({ ...prev, districtCode: '', wardCode: '' }));
      setSelectedDistrict('');
      setSelectedWard('');
    } else if (name === 'districtCode') {
      const selectedDistrictName = districts.data?.find((d: { code: string; }) => d.code === value)?.name || '';
      setSelectedDistrict(selectedDistrictName);
      setFormData(prev => ({ ...prev, wardCode: '' }));
      setSelectedWard('');
    } else if (name === 'wardCode') {
      const selectedWardName = wards.data?.find((w: { code: string; }) => w.code === value)?.name || '';
      setSelectedWard(selectedWardName);
    }
  };

  // Handler for CourseraEditor
  // const handleEditorChange = (value: string) => {
  //   // setFormData({
  //   //   ...formData,
  //   //   shopDescription: value
  //   // });
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      helpers.notificationMessage("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    // Validate password strength
    if (passwordStrength < 2) {
      helpers.notificationMessage("Mật khẩu quá yếu. Vui lòng tạo mật khẩu mạnh hơn", "error");
      return;
    }

    // Validate DOB
    if (dobError) {
      helpers.notificationMessage("Vui lòng chọn ngày sinh hợp lệ", "error");
      return;
    }

    // Validate seller fields if role is seller
    if (formData.role === UserRoleInteger.SELLER) {
      // if (!formData.shopName.trim()) {
      //   helpers.notificationMessage("Vui lòng nhập tên cửa hàng", "error");
      //   return;
      // }
      // if (!formData.shopDescription.trim()) {
      //   helpers.notificationMessage("Vui lòng nhập mô tả cửa hàng", "error");
      //   return;
      // }
      // if (!formData.businessType.trim()) {
      //   helpers.notificationMessage("Vui lòng nhập loại hình kinh doanh", "error");
      //   return;
      // }
      // if (!formData.bankName.trim()) {
      //   helpers.notificationMessage("Vui lòng chọn ngân hàng", "error");
      //   return;
      // }
      // if (!formData.bankAccountNumber.trim()) {
      //   helpers.notificationMessage("Vui lòng nhập số tài khoản ngân hàng", "error");
      //   return;
      // }
      // if (!formData.bankAccountHolder.trim()) {
      //   helpers.notificationMessage("Vui lòng nhập tên chủ tài khoản ngân hàng", "error");
      //   return;
      // }
    }

    register.mutate({
      name: formData.name?.trim() || '',
      email: formData.email.trim(),
      password: formData.password.trim(),
      phoneNumber: formData.phoneNumber.toString(),
      address: fullAddress || '',
      gender: formData.gender,
      dob: formData.dob ? new Date(formData.dob) : new Date(),
      role: formData.role,
      ...(formData.role === UserRoleInteger.SELLER && {
        // shopName: formData.shopName.trim(),
        // shopDescription: formData.shopDescription.trim(),
        // businessType: formData.businessType.trim(),
        // bankName: formData.bankName.trim(),
        // bankAccountNumber: formData.bankAccountNumber.trim(),
        // bankAccountHolder: formData.bankAccountHolder.trim(),
      })
    });
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Yếu';
    if (passwordStrength === 2) return 'Trung bình';
    if (passwordStrength === 3) return 'Tốt';
    return 'Mạnh';
  };

  // Helper for react-select options
  // const getBankOptions = (banks: Array<{ code: string; name: string; logo?: string }>) =>
  //   banks.map((bank) => ({
  //     value: bank.code,
  //     label: (
  //       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  //         {bank.logo && (
  //           <img src={bank.logo} alt={bank.name} style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: 4 }} />
  //         )}
  //         <span>{bank.name}</span>
  //       </div>
  //     ),
  //     bank,
  //   }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full -top-20 -right-20 blur-3xl"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -bottom-20 -left-20 blur-3xl"></div>

        {/* Animated Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-amber-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link to={ROUTER_URL.COMMON.HOME}>
            <h2 className="text-3xl font-bold text-amber-400 mb-1">HORIZON CONVERGIA</h2>
            <p className="text-gray-300 text-sm tracking-wider uppercase">Thế giới xe máy của bạn</p>
          </Link>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg py-8 px-4 sm:px-10 rounded-xl shadow-2xl border border-white/10"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white">Đăng Ký Tài Khoản</h2>
            <p className="mt-2 text-sm text-gray-300">
              Đã có tài khoản?{' '}
              <Link to={ROUTER_URL.AUTH.LOGIN} className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                Đăng nhập ngay
              </Link>
            </p>

            {/* Selected Role Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-600"
            >
              <span className="text-xs text-gray-400 mr-2">Đăng ký với tư cách:</span>
              <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${formData.role === UserRoleInteger.BUYER
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                {formData.role === UserRoleInteger.BUYER ? (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    NGƯỜI MUA
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    NGƯỜI BÁN
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                  Họ và tên
                </label>
                <div className="mt-1 relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Nguyễn Văn A"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200">
                  Số điện thoại
                </label>
                <div className="mt-1 relative">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phoneNumber || undefined}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0123456789"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="example@gmail.com"
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Mật khẩu
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="••••••••"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                {/* Password strength meter */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-400">
                      Độ mạnh: <span className={passwordStrength > 2 ? "text-amber-400" : "text-gray-300"}>{getStrengthText()}</span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                  Xác nhận mật khẩu
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="••••••••"
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">Mật khẩu xác nhận không khớp</p>
                )}
              </div>
            </div>

            {/* Vietnam Address Selection */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="provinceCode" className="block text-sm font-medium text-gray-200">
                    Tỉnh/Thành phố
                  </label>
                  <div className="mt-1">
                    <select
                      id="provinceCode"
                      name="provinceCode"
                      value={formData.provinceCode}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.data?.map((province: { code: string | number, name: React.ReactNode }) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="districtCode" className="block text-sm font-medium text-gray-200">
                    Quận/Huyện
                  </label>
                  <div className="mt-1">
                    <select
                      id="districtCode"
                      name="districtCode"
                      value={formData.districtCode}
                      onChange={handleChange}
                      disabled={!formData.provinceCode}
                      className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.data?.map((district: { code: string | number, name: React.ReactNode }) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="wardCode" className="block text-sm font-medium text-gray-200">
                    Phường/Xã
                  </label>
                  <div className="mt-1">
                    <select
                      id="wardCode"
                      name="wardCode"
                      value={formData.wardCode}
                      onChange={handleChange}
                      disabled={!formData.districtCode}
                      className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.data?.map((ward: { code: string | number; name: React.ReactNode }) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-200">
                  Địa chỉ chi tiết
                </label>
                <div className="mt-1 relative">
                  <input
                    id="streetAddress"
                    name="streetAddress"
                    type="text"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Số nhà, tên đường..."
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {fullAddress && (
                <div className="rounded-lg bg-gray-800/30 border border-gray-700 p-3">
                  <p className="text-sm text-gray-300">
                    <span className="text-xs font-medium text-amber-400">Địa chỉ đầy đủ:</span> {fullAddress}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-200">
                  Giới tính
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option>Chọn giới tính</option>
                    <option value={Gender.MALE}>Nam</option>
                    <option value={Gender.FEMALE}>Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-200">
                  Ngày sinh
                </label>
                <div className="mt-1">
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    min={(() => {
                      const minDate = new Date();
                      minDate.setFullYear(minDate.getFullYear() - 100);
                      return minDate.toISOString().split('T')[0];
                    })()}
                    max={new Date().toISOString().split('T')[0]}
                    className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                {dobError && <p className="mt-1 text-xs text-red-400">{dobError}</p>}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-200 mb-3">
                Loại tài khoản <span className="text-red-400">*</span>
              </label>
              <div className="mt-1">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <input
                      id="role-buyer"
                      name="role"
                      type="radio"
                      value={UserRoleInteger.BUYER}
                      checked={formData.role === UserRoleInteger.BUYER}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="role-buyer"
                      className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform ${formData.role === UserRoleInteger.BUYER
                        ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 shadow-lg shadow-amber-500/25 scale-105'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                        }`}
                    >
                      {/* Selected indicator */}
                      {formData.role === UserRoleInteger.BUYER && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}

                      <div className={`p-3 rounded-full mb-3 ${formData.role === UserRoleInteger.BUYER
                        ? 'bg-amber-500/20'
                        : 'bg-gray-700/50'
                        }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>

                      <span className={`font-bold text-lg mb-1 ${formData.role === UserRoleInteger.BUYER ? 'text-amber-300' : 'text-gray-200'
                        }`}>
                        Người mua
                      </span>
                      <span className={`text-xs text-center ${formData.role === UserRoleInteger.BUYER ? 'text-amber-200' : 'text-gray-400'
                        }`}>
                        Mua sắm và đặt hàng
                      </span>

                      {/* Animated background when selected */}
                      {formData.role === UserRoleInteger.BUYER && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/5 to-amber-600/5 -z-10"
                        />
                      )}
                    </label>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <input
                      id="role-seller"
                      name="role"
                      type="radio"
                      value={UserRoleInteger.SELLER}
                      checked={formData.role === UserRoleInteger.SELLER}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="role-seller"
                      className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform ${formData.role === UserRoleInteger.SELLER
                        ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 shadow-lg shadow-blue-500/25 scale-105'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                        }`}
                    >
                      {/* Selected indicator */}
                      {formData.role === UserRoleInteger.SELLER && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}

                      <div className={`p-3 rounded-full mb-3 ${formData.role === UserRoleInteger.SELLER
                        ? 'bg-blue-500/20'
                        : 'bg-gray-700/50'
                        }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>

                      <span className={`font-bold text-lg mb-1 ${formData.role === UserRoleInteger.SELLER ? 'text-blue-300' : 'text-gray-200'
                        }`}>
                        Người bán
                      </span>
                      <span className={`text-xs text-center ${formData.role === UserRoleInteger.SELLER ? 'text-blue-200' : 'text-gray-400'
                        }`}>
                        Kinh doanh và bán hàng
                      </span>

                      {/* Animated background when selected */}
                      {formData.role === UserRoleInteger.SELLER && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-600/5 -z-10"
                        />
                      )}
                    </label>
                  </motion.div>
                </div>

                {/* Role description */}
                <div className="mt-4 p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-amber-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-300">
                      {formData.role === UserRoleInteger.BUYER
                        ? "Với tài khoản Người mua, bạn có thể duyệt và mua các sản phẩm xe máy từ nhiều cửa hàng khác nhau."
                        : "Với tài khoản Người bán, bạn có thể tạo cửa hàng riêng và bán các sản phẩm xe máy của mình."
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller-specific fields */}
            {/* {formData.role === UserRoleInteger.SELLER && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 border border-amber-500/30 rounded-lg p-4 bg-amber-500/5"
              >
                <React.Fragment>
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-lg font-medium text-amber-400">Thông tin cửa hàng</h3>
                  </div>

                  <div>
                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-200">
                      Tên cửa hàng <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="shopName"
                        name="shopName"
                        type="text"
                        required
                        value={formData.shopName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Nhập tên cửa hàng của bạn"
                      />
                      <div className="absolute left-3 top-3.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-200">
                      Mô tả cửa hàng <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1">
                      <CourseraEditor
                        id="shopDescription"
                        value={formData.shopDescription}
                        onChange={handleEditorChange}
                        placeholder="Mô tả về cửa hàng, sản phẩm và dịch vụ của bạn..."
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-200">
                      Loại hình kinh doanh <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="businessType"
                        name="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">Chọn loại hình kinh doanh</option>
                        <option value="motorcycle-parts">Phụ tùng xe máy</option>
                        <option value="motorcycle-accessories">Phụ kiện xe máy</option>
                        <option value="motorcycle-maintenance">Bảo dưỡng sửa chữa</option>
                        <option value="motorcycle-sales">Mua bán xe máy</option>
                        <option value="motorcycle-rental">Cho thuê xe máy</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-200">
                      Tên ngân hàng <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1">
                      <Select
                        inputId="bankName"
                        name="bankName"
                        options={getBankOptions(banks)}
                        value={getBankOptions(banks).find((opt: { value: string }) => opt.value === formData.bankName) || null}
                        onChange={option => setFormData({ ...formData, bankName: option?.value || '' })}
                        isLoading={isLoadingBanks}
                        placeholder={isLoadingBanks ? 'Đang tải danh sách ngân hàng...' : 'Chọn ngân hàng'}
                        classNamePrefix="react-select"
                        styles={{
                          option: (provided) => ({ ...provided, display: 'flex', alignItems: 'center', gap: 8 }),
                          singleValue: (provided) => ({ ...provided, display: 'flex', alignItems: 'center', gap: 8 }),
                        }}
                        isClearable
                        noOptionsMessage={() => 'Không tìm thấy ngân hàng'}
                      />
                    </div>
                  </div>

                  {formData.bankName && !isLoadingBanks && (
                    <div className="mt-2 p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
                      {(() => {
                        const selectedBank = banks?.find(bank => bank.code === formData.bankName);
                        return selectedBank ? (
                          <div className="flex items-center space-x-3">
                            {selectedBank.logo ? (
                              <img
                                src={selectedBank.logo}
                                alt={selectedBank.name}
                                className="w-8 h-8 object-contain rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-sm text-gray-300 font-bold">
                                {selectedBank.code?.slice(0, 2) || 'NH'}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-200">{selectedBank.name}</p>
                              <p className="text-xs text-gray-400">Mã: {selectedBank.code}</p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </React.Fragment>

                <div>
                  <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-200">
                    Số tài khoản ngân hàng <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      type="text"
                      required
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Nhập số tài khoản ngân hàng"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2zm-5-3a1 1 0 11-2 0 1 1 0 012 0zm-4 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="bankAccountHolder" className="block text-sm font-medium text-gray-200">
                    Chủ tài khoản ngân hàng <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="bankAccountHolder"
                      name="bankAccountHolder"
                      type="text"
                      required
                      value={formData.bankAccountHolder}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 bg-gray-800/50 text-white focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Nhập tên chủ tài khoản ngân hàng"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>


              </motion.div>
            )} */}

            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-300">
                Tôi đồng ý với{' '}
                <a href="#" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
                  chính sách bảo mật
                </a>
              </label>
            </div>

            {/* Registration Summary */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-200 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Tóm tắt đăng ký
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Loại tài khoản:</span>
                  <div className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${formData.role === UserRoleInteger.BUYER
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-blue-500/20 text-blue-300'
                    }`}>
                    {formData.role === UserRoleInteger.BUYER ? (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Người mua
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Người bán
                      </>
                    )}
                  </div>
                </div>
                {formData.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-gray-200">{formData.email}</span>
                  </div>
                )}
                {formData.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Họ tên:</span>
                    <span className="text-gray-200">{formData.name}</span>
                  </div>
                )}
                {/* {formData.role === UserRoleInteger.SELLER && formData.shopName && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tên cửa hàng:</span>
                    <span className="text-blue-300">{formData.shopName}</span>
                  </div>
                )} */}
                {/* {formData.role === UserRoleInteger.SELLER && formData.bankName && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ngân hàng:</span>
                    <span className="text-blue-300">{formData.bankName}</span>
                  </div>
                )} */}
                {/* {formData.role === UserRoleInteger.SELLER && formData.bankAccountNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Số tài khoản:</span>
                    <span className="text-blue-300">{formData.bankAccountNumber}</span>
                  </div>
                )} */}
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={register.isSuccess}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {register.isError ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Đăng ký
              </motion.button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 backdrop-blur text-gray-300">Hoặc đăng ký với</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-800/50 text-sm font-medium text-gray-200 hover:bg-gray-700/50 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm bg-gray-800/50 text-sm font-medium text-gray-200 hover:bg-gray-700/50 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div >
    </div >
  );
};

export default RegisterPage;