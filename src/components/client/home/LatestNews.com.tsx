import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../../hooks';
import type { NewsResponse } from '../../../types/news/News.res.type';

const LatestNews: React.FC = () => {
  const { getAllNews } = useNews();
  
  // Lấy 3 bài viết đầu tiên từ API
  const isLoading = getAllNews.isLoading;
  const isError = getAllNews.isError;
  const newsData: NewsResponse[] = getAllNews.data?.data ? getAllNews.data.data.slice(0, 6) : [];

  // Helper function để format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Helper function để strip HTML tags và tạo excerpt từ content
  const stripHtmlTags = (html: string) => {
    // Tạo một temporary element để parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const createExcerpt = (content: string, maxLength: number = 150) => {
    // Loại bỏ HTML tags trước khi tạo excerpt
    const plainText = stripHtmlTags(content);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  // Hiển thị loading
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="text-gray-600">Đang tải tin tức...</div>
          </div>
        </div>
      </section>
    );
  }

  // Hiển thị error
  if (isError) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="text-red-600">Không thể tải tin tức. Vui lòng thử lại sau.</div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pl-4 border-l-4 border-amber-400">
            Tin Tức & Kiến Thức
          </h2>
          <Link to="/tin-tuc" className="text-amber-600 hover:text-amber-700 font-medium flex items-center transition-colors duration-300">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsData.length > 0 ? (
            newsData.map((news: NewsResponse) => (
              <Link key={news.id} to={`/tin-tuc/${news.id}`} className="group">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-transparent hover:border-amber-200">
                  <div className="relative h-52">
                    <img 
                      src={news.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs font-medium text-white bg-amber-500 rounded-full inline-block px-3 py-1">
                        {formatDate(news.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">{news.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm flex-grow">{createExcerpt(news.content)}</p>
                    <div className="flex items-center text-amber-600 font-medium text-sm mt-auto">
                      <span>Đọc tiếp</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-gray-600 text-center">
                <p className="text-lg mb-2">Chưa có tin tức nào</p>
                <p className="text-sm">Hãy quay lại sau để xem những tin tức mới nhất</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;