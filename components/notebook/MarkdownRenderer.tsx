'use client';
import React from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    // Simple regex-based markdown renderer
    const renderMarkdown = (text: string): string => {
        let html = text
            // Escape HTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')

            // Code blocks (triple backticks)
            .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-lg my-2 overflow-x-auto"><code class="text-sm">$2</code></pre>')

            // Inline code (single backticks)
            .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')

            // Headers
            .replace(/^###### (.*$)/gm, '<h6 class="text-sm font-semibold mt-3 mb-1">$1</h6>')
            .replace(/^##### (.*$)/gm, '<h5 class="text-sm font-semibold mt-3 mb-1">$1</h5>')
            .replace(/^#### (.*$)/gm, '<h4 class="text-base font-semibold mt-4 mb-2">$1</h4>')
            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-2 text-marker">$1</h2>')
            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-3 text-marker">$1</h1>')

            // Bold and italic
            .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
            .replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>')
            .replace(/__([^_]+)__/g, '<strong class="font-semibold">$1</strong>')
            .replace(/_([^_]+)_/g, '<em class="italic">$1</em>')

            // Blockquotes
            .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-marker pl-4 py-1 my-2 italic text-muted-foreground">$1</blockquote>')

            // Unordered lists
            .replace(/^[\-\*] (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')

            // Ordered lists
            .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')

            // Horizontal rule
            .replace(/^---$/gm, '<hr class="border-muted my-4" />')

            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-marker hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')

            // Line breaks
            .replace(/\n\n/g, '</p><p class="my-2">')
            .replace(/\n/g, '<br />');

        // Wrap in paragraph
        html = `<p class="my-2">${html}</p>`;

        // Clean up empty paragraphs
        html = html.replace(/<p class="my-2"><\/p>/g, '');

        // Wrap consecutive list items in ul/ol
        html = html.replace(/(<li class="ml-4 list-disc">.*?<\/li>)+/g, '<ul class="my-2">$&</ul>');
        html = html.replace(/(<li class="ml-4 list-decimal">.*?<\/li>)+/g, '<ol class="my-2">$&</ol>');

        return html;
    };

    return (
        <div
            className={`markdown-content prose prose-sm max-w-none ${className ?? ''}`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
    );
}

export default MarkdownRenderer;
