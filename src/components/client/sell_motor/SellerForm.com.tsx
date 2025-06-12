// src/components/client/sell_motor/SellerForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type FormData = {
  title: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  price: string;
  description: string;
  condition: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  images: File[];
};

const initialFormData: FormData = {
  title: '',
  brand: '',
  model: '',
  year: '',
  mileage: '',
  price: '',
  description: '',
  condition: 'good',
  name: '',
  phone: '',
  email: '',
  city: '',
  images: [],
};

const brands = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW', 'Harley-Davidson', 'KTM', 'Triumph'];
const conditions = ['excellent', 'good', 'fair', 'poor'];
const conditionsLabel = {
  excellent: 'Rất tốt',
  good: 'Tốt',
  fair: 'Khá',
  poor: 'Cần sửa chữa',
};

const SellerForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...filesArray] }));

      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...previewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));

    const newPreviews = [...imagePreview];
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreview(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData(initialFormData);
        setImagePreview([]);
        setSuccess(false);
        setStep(1);
      }, 3000);
    }, 2000);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white"
          >
            Đăng Tin <span className="text-amber-500">Bán Xe</span> Của Bạn
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Cung cấp thông tin chi tiết về xe của bạn để thu hút người mua tiềm năng
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {['Thông tin xe', 'Hình ảnh', 'Thông tin liên hệ'].map((label, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step > i ? 'bg-amber-500 text-gray-900' : step === i + 1 ? 'bg-amber-500/80 text-gray-900' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {i + 1}
                  </div>
                  <span className={`mt-2 text-sm ${step > i ? 'text-amber-400' : step === i + 1 ? 'text-white' : 'text-gray-500'}`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-2 bg-gray-700 rounded-full">
              <div 
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700"
          >
            {success ? (
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Đăng Tin Thành Công!</h3>
                <p className="text-gray-400 mb-6">Tin đăng của bạn sẽ được kiểm duyệt và xuất hiện trên trang chủ sau ít phút.</p>
                <div className="animation-pulse">
                  <span className="text-amber-400">Đang chuyển hướng...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Thông Tin Xe Máy</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                          Tiêu đề đăng tin *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="VD: Honda CBR650R 2021 chính chủ"
                          className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-2">
                          Thương hiệu *
                        </label>
                        <select
                          id="brand"
                          name="brand"
                          required
                          value={formData.brand}
                          onChange={handleChange}
                          className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="">Chọn thương hiệu</option>
                          {brands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
                          Model *
                        </label>
                        <input
                          type="text"
                          id="model"
                          name="model"
                          required
                          value={formData.model}
                          onChange={handleChange}
                          placeholder="VD: CBR650R, Ninja ZX-10R"
                          className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
                          Năm sản xuất *
                        </label>
                        <input
                          type="number"
                          id="year"
                          name="year"
                          required
                          min="1970"
                          max="2023"
                          value={formData.year}
                          onChange={handleChange}
                          placeholder="VD: 2021"
                          className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="mileage" className="block text-sm font-medium text-gray-300 mb-2">
                          Số Km đã đi *
                        </label>
                        <input
                          type="number"
                          id="mileage"
                          name="mileage"
                          required
                          min="0"
                          value={formData.mileage}
                          onChange={handleChange}
                          placeholder="VD: 5000"
                          className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                          Giá bán (VND) *
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          required
                          min="0"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="VD: 150000000"
                          className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-300 mb-2">
                          Tình trạng xe *
                        </label>
                        <select
                          id="condition"
                          name="condition"
                          required
                          value={formData.condition}
                          onChange={handleChange}
                          className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          {conditions.map((cond) => (
                            <option key={cond} value={cond}>{conditionsLabel[cond as keyof typeof conditionsLabel]}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                          Mô tả chi tiết *
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          required
                          rows={5}
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Mô tả chi tiết về xe, tình trạng, lịch sử bảo dưỡng, trang bị thêm..."
                          className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all"
                      >
                        Tiếp Theo
                      </motion.button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Hình Ảnh Xe</h3>
                    
                    <div className="bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg p-8">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h4 className="text-lg font-medium text-white mb-2">Kéo thả hoặc nhấp để tải lên</h4>
                        <p className="text-gray-400 mb-4">Hỗ trợ JPG, PNG hoặc WEBP (tối đa 5MB mỗi ảnh)</p>
                        <input
                          type="file"
                          id="images"
                          name="images"
                          accept="image/jpeg, image/png, image/webp"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="images"
                          className="px-6 py-3 bg-amber-500 rounded-lg text-gray-900 font-bold cursor-pointer inline-block hover:bg-amber-400 transition-colors"
                        >
                          Chọn Ảnh
                        </label>
                      </div>
                    </div>
                    
                    {imagePreview.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-white font-medium mb-4">Ảnh đã tải lên ({imagePreview.length})</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {imagePreview.map((src, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={src}
                                alt={`preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={prevStep}
                        className="px-8 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-medium hover:bg-gray-600 transition-all"
                      >
                        Quay Lại
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all"
                        >
                          Tiếp Theo
                        </motion.button>
                      </div>
                    </div>
                  )}
  
                  {step === 3 && (
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-white mb-6">Thông Tin Liên Hệ</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Họ tên *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Họ và tên của bạn"
                            className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                            Số điện thoại *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại liên hệ"
                            className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email của bạn (không bắt buộc)"
                            className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                            Thành phố/Tỉnh *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="VD: TP. Hồ Chí Minh, Hà Nội"
                            className="bg-gray-700 text-white border border-gray-600 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center">
                          <input
                            id="agree-terms"
                            name="agree-terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-600 rounded bg-gray-700"
                          />
                          <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-300">
                            Tôi đồng ý với{' '}
                            <a href="#" className="text-amber-400 hover:text-amber-300">
                              Điều khoản dịch vụ
                            </a>{' '}
                            và{' '}
                            <a href="#" className="text-amber-400 hover:text-amber-300">
                              Chính sách bảo mật
                            </a>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={prevStep}
                          className="px-8 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-medium hover:bg-gray-600 transition-all"
                        >
                          Quay Lại
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={submitting}
                          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg text-gray-900 font-bold shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-70"
                        >
                          {submitting ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Đang Gửi...
                            </div>
                          ) : 'Đăng Tin Ngay'}
                        </motion.button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    );
  };
  
  export default SellerForm;