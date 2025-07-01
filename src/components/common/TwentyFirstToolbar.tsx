import React, { useEffect, useState } from 'react';

const TwentyFirstToolbar: React.FC = () => {
    // Store dynamically loaded toolbar component
    const [ToolbarComponent, setToolbarComponent] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        // Never attempt to load in production
        if (!import.meta.env.DEV) return;

        // Dynamically import packages to avoid bundling them in prod builds
        const loadToolbar = async () => {
            try {
                const [{ TwentyFirstToolbar: Toolbar }, { ReactPlugin }] = await Promise.all([
                    import('@21st-extension/toolbar-react'),
                    import('@21st-extension/react')
                ]);

                // Create a configured toolbar component with React plugin
                const ConfiguredToolbar = () => (
                    <Toolbar
                        config={{
                            plugins: [ReactPlugin]
                        }}
                    />
                );

                setToolbarComponent(() => ConfiguredToolbar);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.warn('21st.dev toolbar failed to load:', error);
            }
        };

        loadToolbar();
    }, []);

    // Render nothing if toolbar not ready or in production
    if (!import.meta.env.DEV || !ToolbarComponent) return null;

    return <ToolbarComponent />;
};

export default TwentyFirstToolbar; 