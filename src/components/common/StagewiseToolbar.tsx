import React from 'react';

const StagewiseToolbar: React.FC = () => {
    // Only render in development mode
    if (!import.meta.env.DEV) {
        return null;
    }

    try {
        // Use dynamic import with require for better compatibility
        const { StagewiseToolbar: Toolbar } = require('@stagewise/toolbar-react');
        const { ReactPlugin } = require('@stagewise-plugins/react');

        return (
            <Toolbar
                config={{
                    plugins: [ReactPlugin]
                }}
            />
        );
    } catch (error) {
        // Silently fail if stagewise packages are not available
        if (import.meta.env.DEV) {
            console.warn('Stagewise toolbar packages not found. Run: pnpm add -D @stagewise/toolbar-react @stagewise-plugins/react');
        }
        return null;
    }
};

export default StagewiseToolbar; 