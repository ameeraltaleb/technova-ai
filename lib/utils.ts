// TechNova AI — Utility Functions

// Curated tech-related images from Unsplash for article placeholders
const TECH_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop&q=80', // AI concept
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop&q=80', // Code editor
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop&q=80', // Cybersecurity
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop&q=80', // Data globe
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop&q=80', // Security
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop&q=80', // Circuit board
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop&q=80', // Code screen
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop&q=80', // React
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop&q=80', // AI robot
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop&q=80', // Blockchain
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop&q=80', // Design tools
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop&q=80', // Productivity
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop&q=80', // Matrix code
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=450&fit=crop&q=80', // Cloud servers
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop&q=80', // Network
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop&q=80', // Laptop tech
];

/**
 * Returns the article's image URL, or a consistent placeholder based on article ID
 */
export function getArticleImage(article: { image: string; id: string }): string {
  if (article.image && article.image.trim() !== '') return article.image;

  // Generate a consistent index from the article ID
  const hash = article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TECH_IMAGES[hash % TECH_IMAGES.length];
}

/**
 * Parses h2 headings from HTML content for Table of Contents
 */
export function parseTOC(htmlContent: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ id, text });
  }
  return headings;
}

/**
 * Injects IDs into h2 tags in HTML content for anchor linking
 */
export function injectHeadingIds(htmlContent: string): string {
  return htmlContent.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attrs, inner) => {
    const text = inner.replace(/<[^>]*>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
}
