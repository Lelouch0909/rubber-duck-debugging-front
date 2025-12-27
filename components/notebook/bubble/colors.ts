// Premium color palette - adapts to theme
export const PREMIUM_COLORS = {
    bubbles: [
        { bg: 'rgba(139, 92, 246, 0.85)', border: 'rgba(167, 139, 250, 0.6)', glow: 'rgba(139, 92, 246, 0.4)' },   // Purple
        { bg: 'rgba(59, 130, 246, 0.85)', border: 'rgba(96, 165, 250, 0.6)', glow: 'rgba(59, 130, 246, 0.4)' },    // Blue
        { bg: 'rgba(16, 185, 129, 0.85)', border: 'rgba(52, 211, 153, 0.6)', glow: 'rgba(16, 185, 129, 0.4)' },    // Emerald
        { bg: 'rgba(236, 72, 153, 0.85)', border: 'rgba(244, 114, 182, 0.6)', glow: 'rgba(236, 72, 153, 0.4)' },   // Pink
        { bg: 'rgba(245, 158, 11, 0.85)', border: 'rgba(251, 191, 36, 0.6)', glow: 'rgba(245, 158, 11, 0.4)' },    // Amber
        { bg: 'rgba(99, 102, 241, 0.85)', border: 'rgba(129, 140, 248, 0.6)', glow: 'rgba(99, 102, 241, 0.4)' },   // Indigo
        { bg: 'rgba(20, 184, 166, 0.85)', border: 'rgba(45, 212, 191, 0.6)', glow: 'rgba(20, 184, 166, 0.4)' },    // Teal
        { bg: 'rgba(168, 85, 247, 0.85)', border: 'rgba(192, 132, 252, 0.6)', glow: 'rgba(168, 85, 247, 0.4)' },   // Violet
    ],
    connections: {
        weak: 'rgba(148, 163, 184, 0.4)',
        medium: 'rgba(129, 140, 248, 0.5)',
        strong: 'rgba(139, 92, 246, 0.7)',
    }
};

export const getConnectionColor = (similarity: number): string => {
    if (similarity <= 3) return PREMIUM_COLORS.connections.weak;
    if (similarity <= 6) return PREMIUM_COLORS.connections.medium;
    return PREMIUM_COLORS.connections.strong;
};

export const getConnectionWidth = (similarity: number): number => {
    return 1 + (similarity / 10) * 3;
};

export const getBubbleColor = (index: number) =>
    PREMIUM_COLORS.bubbles[index % PREMIUM_COLORS.bubbles.length];
