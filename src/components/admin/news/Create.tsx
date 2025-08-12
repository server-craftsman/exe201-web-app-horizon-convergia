import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateNewsRequest } from '../../../types/news/News.req.type';
import { helpers } from '@utils/index';
import { useNews } from '../../../hooks/modules/useNews';
import { useCategory } from '../../../hooks/modules/useCategory';

interface CreateNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNewsModal = ({ isOpen, onClose }: CreateNewsModalProps) => {
  const [formData, setFormData] = useState<CreateNewsRequest>({
    title: '',
    content: '',
    imageUrl: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createNews } = useNews();
  const { useGetAllCategories } = useCategory();
  const { data: categories } = useGetAllCategories();

  // Formatting functions - improved to only format selected text
  const insertText = (prefix: string, suffix: string = '') => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    // Only apply formatting if text is selected, otherwise just position cursor
    if (selectedText.length === 0 && (prefix.includes('*') || prefix.includes('_') || prefix.includes('~'))) {
      // For formatting that requires selection, just move cursor and don't add marks
      textarea.focus();
      return;
    }
    
    const newText = prefix + selectedText + suffix;
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    
    setFormData(prev => ({
      ...prev,
      content: newValue
    }));
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      if (selectedText.length > 0) {
        // If text was selected, position cursor after the formatting
        const newCursorPosition = start + prefix.length + selectedText.length + suffix.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      } else {
        // If no text selected, position cursor after prefix (for headers, lists, etc.)
        const newPosition = start + prefix.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Enhanced paste handler to preserve images and content better
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    
    // Check for images first
    const items = Array.from(clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        // Handle image upload
        handleImageUpload(file);
        return;
      }
    }
    
    // Handle text/HTML content - minimal conversion to preserve original formatting
    const htmlData = clipboardData.getData('text/html');
    const plainData = clipboardData.getData('text/plain');
    
    let cleanedText = '';
    
    if (htmlData) {
      // Minimal HTML cleanup while preserving structure and images
      cleanedText = htmlData
        // Convert basic headers
        .replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (_, level, text) => {
          const hashes = '#'.repeat(parseInt(level));
          return `${hashes} ${text}\n\n`;
        })
        // Convert basic formatting - only if really needed
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
        // Convert links
        .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        // KEEP IMAGES AS HTML for proper display
        .replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '<img src="$1" style="max-width: 100%; height: auto;" />')
        // Convert paragraphs and line breaks
        .replace(/<p[^>]*>/gi, '')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<div[^>]*>/gi, '')
        .replace(/<\/div>/gi, '\n')
        // Convert lists
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
        .replace(/<ul[^>]*>|<\/ul>/gi, '')
        .replace(/<ol[^>]*>|<\/ol>/gi, '')
        // Convert blockquotes
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
        // Remove remaining unwanted tags but keep img tags
        .replace(/<(?!img\s)[^>]*>/g, '')
        // Clean up HTML entities
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        // Clean up excessive whitespace
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();
    } else {
      // Use plain text as fallback
      cleanedText = plainData;
    }

    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = textarea.value.substring(0, start) + cleanedText + textarea.value.substring(end);
      
      setFormData(prev => ({
        ...prev,
        content: newValue
      }));

      // Set cursor position after pasted content
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + cleanedText.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  // Handle image upload from computer
  const handleImageUpload = async (file: File) => {
    try {
      // Create a simple image URL (you can integrate with your upload service)
      const imageUrl = URL.createObjectURL(file);
      
      // Insert image markdown at cursor position
      if (contentRef.current) {
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const imageMarkdown = `![${file.name}](${imageUrl})\n`;
        const newValue = textarea.value.substring(0, start) + imageMarkdown + textarea.value.substring(start);
        
        setFormData(prev => ({
          ...prev,
          content: newValue
        }));

        setTimeout(() => {
          textarea.focus();
          const newPosition = start + imageMarkdown.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
      
      helpers.notificationMessage('Ảnh đã được thêm vào nội dung!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      helpers.notificationMessage('Lỗi khi upload ảnh', 'error');
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      helpers.notificationMessage('Vui lòng chọn file ảnh hợp lệ', 'error');
    }
    // Reset input
    e.target.value = '';
  };

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title?.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    
    // Kiểm tra nội dung
    if (!formData.content?.trim()) newErrors.content = 'Nội dung là bắt buộc';
    
    if (!formData.imageUrl?.trim()) newErrors.imageUrl = 'URL hình ảnh là bắt buộc';
    if (!formData.categoryId?.trim()) newErrors.categoryId = 'Danh mục là bắt buộc';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await createNews.mutateAsync(formData);
      helpers.notificationMessage('Tạo tin tức thành công!', 'success');
      onClose();
      // Reset form
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        categoryId: '',
      });
      
      // Thêm dòng này để load lại dữ liệu sau khi tạo thành công
      window.location.reload();
    } catch (error: any) {
      console.error('Error creating news:', error);
      helpers.notificationMessage(
        error?.response?.data?.message || 'Có lỗi xảy ra khi tạo tin tức',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      categoryId: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Thêm tin tức mới</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tiêu đề *
              </label>
              <input
                ref={titleInputRef}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề tin tức"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL hình ảnh *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Danh mục *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục</option>
                {categories?.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
            </div>

            {/* Content */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Nội dung *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-400"
                >
                  {showPreview ? '📝 Edit' : '👁️ Preview'}
                </button>
              </div>
              
              {/* Enhanced Formatting Toolbar */}
              <div className="bg-gray-700 rounded-t-lg p-3 border border-gray-600 border-b-0">
                <div className="flex flex-wrap gap-2">
                  {/* Text Formatting */}
                  <div className="flex gap-1 border-r border-gray-500 pr-2">
                    <button
                      type="button"
                      onClick={() => insertText('**', '**')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Bold (Select text first)"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('*', '*')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Italic (Select text first)"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('__', '__')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Underline (Select text first)"
                    >
                      <u>U</u>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('~~', '~~')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Strikethrough (Select text first)"
                    >
                      <s>S</s>
                    </button>
                  </div>

                  {/* Headers */}
                  <div className="flex gap-1 border-r border-gray-500 pr-2">
                    <button
                      type="button"
                      onClick={() => insertText('# ', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('## ', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('### ', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('#### ', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Heading 4"
                    >
                      H4
                    </button>
                  </div>

                  {/* Lists & Structure */}
                  <div className="flex gap-1 border-r border-gray-500 pr-2">
                    <button
                      type="button"
                      onClick={() => insertText('- ', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Bullet List"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('1. ', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Numbered List"
                    >
                      1. List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('> ', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Quote"
                    >
                      💬 Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('---\n', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Horizontal Line"
                    >
                      ➖ Line
                    </button>
                  </div>

                  {/* Media & Links */}
                  <div className="flex gap-1 border-r border-gray-500 pr-2">
                    <button
                      type="button"
                      onClick={() => insertText('![Alt text](', ' "Title")')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Insert Image URL"
                    >
                      🖼️ URL
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                      title="Upload Image from Computer"
                    >
                      📁 Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('[Link text](', ')')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Insert Link"
                    >
                      🔗 Link
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('`', '`')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Inline Code (Select text first)"
                    >
                      💻 Code
                    </button>
                  </div>

                  {/* Special */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => insertText('```\n', '\n```')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Code Block"
                    >
                      📝 Block
                    </button>
                    <button
                      type="button"
                      onClick={() => insertText('| Column 1 | Column 2 |\n|----------|----------|\n| Data 1   | Data 2   |\n', '')}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      title="Insert Table"
                    >
                      📊 Table
                    </button>
                  </div>
                </div>
                
                {/* Paste Helper */}
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <p className="text-xs text-gray-300">
                    💡 <strong>Tip:</strong> Chọn text trước khi format (Bold/Italic), hoặc copy-paste nội dung từ web (bao gồm cả hình ảnh) để tự động chuyển đổi
                  </p>
                </div>
              </div>
              
              {/* Hidden file input for image upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {showPreview ? (
                // Preview Mode
                <div 
                  className="w-full min-h-[300px] px-3 py-2 border border-gray-600 rounded-b-lg bg-white text-black text-sm leading-relaxed overflow-auto"
                  dangerouslySetInnerHTML={{ 
                    __html: formData.content
                      // Convert markdown-style formatting to HTML for preview
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/__(.*?)__/g, '<u>$1</u>')
                      .replace(/~~(.*?)~~/g, '<strike>$1</strike>')
                      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
                      .replace(/^- (.*$)/gm, '<li>$1</li>')
                      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                      .replace(/\n/g, '<br>')
                  }}
                />
              ) : (
                // Edit Mode
                <textarea
                  ref={contentRef}
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-600 rounded-b-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm leading-relaxed"
                  placeholder="Nhập nội dung tin tức...

📝 Cách sử dụng:
1. CHỌN TEXT trước khi format: **bold**, *italic*, __underline__, ~~strikethrough~~
2. Headers: # H1, ## H2, ### H3, #### H4  
3. Lists: - bullet, 1. numbered
4. Others: > quotes, [links](url), `code`
5. Upload ảnh: Click 📁 Upload hoặc paste ảnh trực tiếp
6. Copy-paste từ web: Giữ nguyên HTML bao gồm ảnh

💡 Click 👁️ Preview để xem kết quả!"
                />
              )}
              
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
              <p className="mt-1 text-xs text-gray-400">
                💡 <strong>Smart Editor:</strong> Copy-paste trực tiếp từ web (giữ nguyên HTML + ảnh) • Click Preview để xem kết quả • Hỗ trợ Markdown + HTML
              </p>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang tạo...' : 'Tạo tin tức'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
