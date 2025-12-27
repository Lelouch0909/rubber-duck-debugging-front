export interface NoteGroup {
    id: string;
    name: string;
    color: string;  // Gradient or color for the galaxy
    createdAt: string;  // ISO date
    updatedAt: string;  // ISO date
}

// Galaxy visual styles - beautiful cosmic gradients
export const GALAXY_GRADIENTS = [
    'radial-gradient(ellipse at center, #667eea 0%, #764ba2 30%, #1a1a2e 70%)',
    'radial-gradient(ellipse at center, #f093fb 0%, #f5576c 30%, #1a1a2e 70%)',
    'radial-gradient(ellipse at center, #4facfe 0%, #00f2fe 30%, #1a1a2e 70%)',
    'radial-gradient(ellipse at center, #43e97b 0%, #38f9d7 30%, #1a1a2e 70%)',
    'radial-gradient(ellipse at center, #fa709a 0%, #fee140 30%, #1a1a2e 70%)',
    'radial-gradient(ellipse at center, #a8edea 0%, #fed6e3 30%, #1a1a2e 70%)',
    'radial-gradient(ellipse at center, #ff9a9e 0%, #fecfef 30%, #1a1a2e 70%)',
    'radial-gradient(ellipse at center, #ffecd2 0%, #fcb69f 30%, #1a1a2e 70%)',
];
