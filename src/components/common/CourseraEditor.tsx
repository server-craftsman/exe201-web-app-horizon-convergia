import React, { useRef, useCallback, useEffect, useState } from 'react';

interface CourseraEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
}

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
        }
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
                {toolbarButtons.map((button) => (
                    <button
                        key={button.command}
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
        </div>
    );
};

export default CourseraEditor; 