import React, { useRef, useCallback, useEffect, useState } from 'react';

interface CourseraEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
}

const COLORS = [
    '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#6366f1', '#a21caf', '#000000', '#ffffff', '#d1d5db', '#fbbf24', '#f87171', '#34d399', '#60a5fa', '#818cf8', '#f472b6', '#f3f4f6'
];

const CourseraEditor: React.FC<CourseraEditorProps> = ({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    className = "",
    disabled = false,
    id
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [currentFormats, setCurrentFormats] = useState({
        bold: false,
        italic: false,
        underline: false
    });
    const [showColorPicker, setShowColorPicker] = useState(false);
    // const [colorAnchor, setColorAnchor] = useState<HTMLButtonElement | null>(null);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Lưu selection khi mở bảng màu
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            setSavedSelection(sel.getRangeAt(0));
        }
    };
    const restoreSelection = () => {
        const sel = window.getSelection();
        if (sel && savedSelection) {
            sel.removeAllRanges();
            sel.addRange(savedSelection);
        }
    };

    // Đóng bảng màu khi click ra ngoài
    useEffect(() => {
        if (!showColorPicker) return;
        const handleClick = (e: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
                setShowColorPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showColorPicker]);

    // Add custom styles to document head
    useEffect(() => {
        const styleId = 'coursera-editor-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = `
                .coursera-editor [contentEditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    display: block;
                }
                
                .coursera-editor h1 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 0.5rem 0;
                    color: #f3f4f6;
                }
                
                .coursera-editor h2 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin: 0.5rem 0;
                    color: #f3f4f6;
                }
                
                .coursera-editor h3 {
                    font-size: 1.1rem;
                    font-weight: bold;
                    margin: 0.5rem 0;
                    color: #f3f4f6;
                }
                
                .coursera-editor ul, .coursera-editor ol {
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }
                
                .coursera-editor li {
                    margin: 0.25rem 0;
                }
                
                .coursera-editor a {
                    color: #f59e0b;
                    text-decoration: underline;
                }
                
                .coursera-editor a:hover {
                    color: #d97706;
                }
                
                .coursera-editor strong {
                    font-weight: bold;
                }
                
                .coursera-editor em {
                    font-style: italic;
                }
                
                .coursera-editor u {
                    text-decoration: underline;
                }
                
                .coursera-editor img {
                    max-width: 100% !important;
                    height: auto !important;
                    border-radius: 8px !important;
                    margin: 12px 0 !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
                    display: block !important;
                    object-fit: cover;
                }
                
                .coursera-editor img[style] {
                    max-width: 100% !important;
                    height: auto !important;
                }
                
                .coursera-editor img:not([src]) {
                    display: none;
                }
                
                .coursera-editor img[src=""] {
                    display: none;
                }
                
                .coursera-editor p {
                    margin: 0.5rem 0;
                }
                
                .coursera-editor br {
                    line-height: 1.5;
                }
                
                .coursera-editor select option {
                    background-color: #374151;
                    color: #d1d5db;
                }
            `;
            document.head.appendChild(styleElement);
        }

        return () => {
            // Don't remove styles on unmount as they might be used by other instances
        };
    }, []);

    // Initialize editor content
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
            
            // Add error handling for images after content is set
            const images = editorRef.current.querySelectorAll('img');
            images.forEach((img) => {
                img.onerror = function() {
                    console.warn('Image failed to load:', img.src);
                    // Optionally hide broken images
                    img.style.display = 'none';
                };
            });
        }
    }, [value]);

    // Update formats based on current selection
    const updateFormats = useCallback(() => {
        setCurrentFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline')
        });
    }, []);

    // Handle content change
    const handleInput = useCallback(() => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            onChange(content);
        }
    }, [onChange]);

    // Handle focus
    const handleFocus = useCallback(() => {
        setIsActive(true);
    }, []);

    // Handle blur
    const handleBlur = useCallback(() => {
        setIsActive(false);
    }, []);

    // Execute formatting command
    const execCommand = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateFormats();
        handleInput();
    }, [updateFormats, handleInput]);

    // Handle key down for shortcuts
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    execCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    execCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    execCommand('underline');
                    break;
            }
        }
    }, [execCommand]);

    // Handle selection change
    const handleSelectionChange = useCallback(() => {
        if (document.activeElement === editorRef.current) {
            updateFormats();
        }
    }, [updateFormats]);

    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [handleSelectionChange]);

    // Handle paste: strip style/background and handle images
    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const clipboardData = e.clipboardData || (window as any).clipboardData;
        
        // Check for images first (from clipboard - screenshot/copied image)
        const items = Array.from(clipboardData.items);
        const imageItem = items.find((item: any) => item.type.startsWith('image/'));
        
        if (imageItem) {
            const file = imageItem.getAsFile();
            if (file) {
                handleImageUpload(file);
                return;
            }
        }
        
        let html = clipboardData.getData('text/html');
        let text = clipboardData.getData('text/plain');

        if (html) {
            // Process HTML content with images
            html = html
                // Convert all img tags with proper styling - keep original src
                .replace(/<img([^>]*?)>/gi, (match, attributes) => {
                    // Extract src from attributes
                    const srcMatch = attributes.match(/src=["']([^"']*?)["']/i);
                    const altMatch = attributes.match(/alt=["']([^"']*?)["']/i);
                    
                    const src = srcMatch ? srcMatch[1] : '';
                    const alt = altMatch ? altMatch[1] : 'Pasted Image';
                    
                    if (src) {
                        return `<img src="${src}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);" alt="${alt}" />`;
                    }
                    return match;
                })
                // Clean up other inline styles but preserve structure
                .replace(/ style="[^"]*"/g, '')
                .replace(/<span[^>]*?>/g, '<span>')
                .replace(/<font[^>]*?>/g, '<font>')
                // Remove unwanted attributes but keep essential ones (src, href, alt)
                .replace(/<((?!img|a)\w+)[^>]*?>/g, '<$1>')
                // Clean up excessive whitespace
                .replace(/\s+/g, ' ')
                .trim();
                
            document.execCommand('insertHTML', false, html);
        } else if (text) {
            document.execCommand('insertText', false, text);
        }
        
        handleInput();
    }, [handleInput]);

    // Handle image upload
    const handleImageUpload = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh hợp lệ!');
            return;
        }

        // Create object URL for immediate display
        const imageUrl = URL.createObjectURL(file);
        
        // Insert image into editor with proper styling
        const imgHtml = `<img src="${imageUrl}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); display: block;" alt="${file.name}" />`;
        
        // Focus editor first
        if (editorRef.current) {
            editorRef.current.focus();
        }
        
        document.execCommand('insertHTML', false, imgHtml);
        handleInput();
        
        // Clean up object URL after some time to prevent memory leaks
        setTimeout(() => {
            URL.revokeObjectURL(imageUrl);
        }, 60000); // 1 minute
        
        // Optional: You can integrate with your upload service here
        // and replace the object URL with the actual uploaded URL
    }, [handleInput]);

    // Handle file input change
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        // Reset input
        e.target.value = '';
    }, [handleImageUpload]);

    const toolbarButtons = [
        {
            command: 'bold',
            icon: 'B',
            title: 'Bold (Ctrl+B)',
            isActive: currentFormats.bold
        },
        {
            command: 'italic',
            icon: 'I',
            title: 'Italic (Ctrl+I)',
            isActive: currentFormats.italic
        },
        {
            command: 'underline',
            icon: 'U',
            title: 'Underline (Ctrl+U)',
            isActive: currentFormats.underline
        },
        {
            command: 'foreColor',
            icon: <span style={{ color: '#f59e0b' }}>A</span>,
            title: 'Màu chữ',
            isActive: false,
            onClick: () => {
                setShowColorPicker((v) => !v);
                // setColorAnchor(e.currentTarget);
                saveSelection();
            }
        },
        {
            command: 'insertUnorderedList',
            icon: '•',
            title: 'Bullet List',
            isActive: false
        },
        {
            command: 'insertOrderedList',
            icon: '1.',
            title: 'Numbered List',
            isActive: false
        },
        {
            command: 'insertImage',
            icon: '🖼️',
            title: 'Upload Image',
            isActive: false,
            onClick: () => {
                fileInputRef.current?.click();
            }
        },
        {
            command: 'createLink',
            icon: '🔗',
            title: 'Insert Link',
            isActive: false,
            onClick: () => {
                const url = prompt('Enter URL:');
                if (url) {
                    execCommand('createLink', url);
                }
            }
        },
        // New features:
        {
            command: 'undo',
            icon: '↺',
            title: 'Undo',
            isActive: false,
            onClick: () => execCommand('undo')
        },
        {
            command: 'redo',
            icon: '↻',
            title: 'Redo',
            isActive: false,
            onClick: () => execCommand('redo')
        },
        {
            command: 'formatBlock',
            icon: '<>',
            title: 'Code Block',
            isActive: false,
            onClick: () => execCommand('formatBlock', 'pre')
        },
        {
            command: 'blockquote',
            icon: '❝',
            title: 'Blockquote',
            isActive: false,
            onClick: () => execCommand('formatBlock', 'blockquote')
        },
        {
            command: 'removeFormat',
            icon: 'Tx',
            title: 'Clear Formatting',
            isActive: false,
            onClick: () => execCommand('removeFormat')
        },
        {
            command: 'insertHorizontalRule',
            icon: '―',
            title: 'Horizontal Line',
            isActive: false,
            onClick: () => execCommand('insertHorizontalRule')
        },
    ];

    return (
        <div className={`coursera-editor ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Toolbar */}
            <div className={`
        border border-gray-600 border-b-0 rounded-t-lg 
        bg-gray-800/50 backdrop-blur-sm 
        px-3 py-2 flex items-center gap-1
        transition-all duration-200
        ${isActive ? 'border-amber-500/50 bg-gray-800/70' : ''}
      `}>
                {toolbarButtons.map((button, idx) => (
                    <span key={button.command || idx} className="relative">
                        <button
                            type="button"
                            onClick={button.onClick || (() => execCommand(button.command))}
                            title={button.title}
                            className={`
              px-2 py-1 rounded text-sm font-medium
              transition-all duration-150
              hover:bg-gray-700/50
              ${button.isActive
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'text-gray-300 border border-transparent'
                                }
            `}
                            disabled={disabled}
                        >
                            {button.icon}
                        </button>
                        {/* Color picker dropdown */}
                        {button.command === 'foreColor' && showColorPicker && (
                            <div
                                ref={colorPickerRef}
                                className="absolute z-50 mt-2 left-0 bg-gray-800 border border-gray-700 rounded shadow-lg p-2 flex flex-wrap gap-1 w-48"
                            >
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="w-6 h-6 rounded-full border-2 border-gray-600 hover:border-amber-500 focus:outline-none"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            editorRef.current?.focus();
                                            restoreSelection();
                                            execCommand('foreColor', color);
                                            setShowColorPicker(false);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </span>
                ))}

                {/* Format dropdown */}
                <div className="ml-2 border-l border-gray-600 pl-2">
                    <select
                        onChange={(e) => execCommand('formatBlock', e.target.value)}
                        className="bg-transparent text-gray-300 text-sm border-none outline-none cursor-pointer"
                        disabled={disabled}
                        defaultValue="div"
                    >
                        <option value="div">Normal</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                    </select>
                </div>
            </div>

            {/* Editor Content */}
            <div
                ref={editorRef}
                id={id}
                contentEditable={!disabled}
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                className={`
          min-h-[120px] max-h-[300px] overflow-y-auto
          border border-gray-600 rounded-b-lg
          bg-gray-800/50 backdrop-blur-sm
          px-3 py-3 text-white text-sm
          focus:outline-none focus:ring-0
          transition-all duration-200
          ${isActive ? 'border-amber-500/50 bg-gray-800/70' : ''}
        `}
                data-placeholder={placeholder}
                suppressContentEditableWarning={true}
                style={{
                    lineHeight: '1.5'
                }}
            />

            {/* Character count */}
            <div className="mt-1 text-xs text-gray-400 text-right">
                {value.replace(/<[^>]*>/g, '').length} ký tự
            </div>

            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

export default CourseraEditor; 