import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
    chart: string;
    className?: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart, className = '' }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [id] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        // Initialize mermaid with configuration
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'inherit',
        });
    }, []);

    useEffect(() => {
        if (!elementRef.current || !chart) return;

        const renderChart = async () => {
            try {
                setError(null);
                
                // Clear previous content
                elementRef.current!.innerHTML = '';

                // Validate and render the mermaid chart
                const { svg } = await mermaid.render(id, chart);
                elementRef.current!.innerHTML = svg;
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError(err instanceof Error ? err.message : 'Failed to render diagram');
                
                // Show error message in the div
                elementRef.current!.innerHTML = `
                    <div style="padding: 1rem; background-color: #fee; border: 1px solid #fcc; border-radius: 0.5rem; color: #c00;">
                        <strong>Diagram Error:</strong> ${err instanceof Error ? err.message : 'Failed to render diagram'}
                    </div>
                `;
            }
        };

        renderChart();
    }, [chart, id]);

    return (
        <div 
            ref={elementRef} 
            className={`mermaid-container ${className}`}
            style={{ minHeight: '100px' }}
        />
    );
};