import React, { useEffect, useState } from 'react';

const StagewiseToolbar: React.FC = () => {
    const [showToolbar, setShowToolbar] = useState(false);
    const [ToolbarComponent, setToolbarComponent] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        // Only work in development mode
        if (!import.meta.env.DEV) {
            return;
        }

        // Keyboard shortcut handler
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.shiftKey && e.key === 'S') {
                setShowToolbar(prev => !prev);
            }
        };

        // Load toolbar when needed
        const loadToolbar = async () => {
            if (ToolbarComponent) return; // Already loaded

            try {
                const [toolbarModule, pluginModule] = await Promise.all([
                    import('@stagewise/toolbar-react'),
                    import('@stagewise-plugins/react')
                ]);

                const { StagewiseToolbar: Toolbar } = toolbarModule;
                const { ReactPlugin } = pluginModule;

                // Create configured component
                const ConfiguredToolbar = () => (
                    <Toolbar
                        config={{
                            plugins: [ReactPlugin]
                        }}
                    />
                );

                setToolbarComponent(() => ConfiguredToolbar);
            } catch (error) {
                console.warn('Stagewise toolbar failed to load:', error);
            }
        };

        // Add keyboard listener
        window.addEventListener('keydown', handleKeyPress);

        // Load toolbar if showing
        if (showToolbar) {
            loadToolbar();
        }

        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showToolbar, ToolbarComponent]);

    // Don't render if not in dev mode, not showing, or component not loaded
    if (!import.meta.env.DEV || !showToolbar || !ToolbarComponent) {
        return null;
    }

    return <ToolbarComponent />;
};

export default StagewiseToolbar; 