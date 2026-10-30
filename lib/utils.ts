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

/**
 * Qualifies links inside article HTML content:
 * - If the article is sponsored (`isSponsored: true`), links pointing to the sponsor's URL or domain
 *   are qualified with `rel="noopener noreferrer nofollow sponsored"`.
 * - Other editorial links to outside sources retain standard `rel="noopener noreferrer"` without `sponsored`.
 * - If not sponsored, standard editorial links remain normal without sponsored or nofollow.
 */
export function qualifyArticleContentLinks(
  htmlContent: string,
  options?: { isSponsored?: boolean; sponsorUrl?: string; affiliateUrl?: string }
): string {
  if (!htmlContent) return '';

  const isSponsored = Boolean(options?.isSponsored);
  const targetUrls: string[] = [];
  const targetHostnames: string[] = [];

  const addTarget = (rawUrl?: string) => {
    if (!rawUrl) return;
    const trimmed = rawUrl.trim();
    if (!trimmed) return;
    targetUrls.push(trimmed.toLowerCase());
    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      if (host) targetHostnames.push(host);
    } catch {
      // ignore
    }
  };

  if (isSponsored) {
    addTarget(options?.sponsorUrl);
    addTarget(options?.affiliateUrl);
  }

  return htmlContent.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    const hrefMatch = attrs.match(/\bhref=(["'])(.*?)\1/i);
    if (!hrefMatch) return match;

    const href = hrefMatch[2].trim();
    // Ignore internal anchor hashes or relative paths
    if (href.startsWith('#') || href.startsWith('/')) {
      return match;
    }

    let isLinkToSponsor = false;
    if (isSponsored && (targetUrls.length > 0 || targetHostnames.length > 0)) {
      const hrefLower = href.toLowerCase();
      if (targetUrls.some((u) => hrefLower.startsWith(u) || u.startsWith(hrefLower))) {
        isLinkToSponsor = true;
      } else {
        try {
          const parsed = new URL(href);
          const parsedHost = parsed.hostname.toLowerCase().replace(/^www\./, '');
          if (targetHostnames.some((h) => parsedHost === h || parsedHost.endsWith(`.${h}`))) {
            isLinkToSponsor = true;
          }
        } catch {
          // ignore
        }
      }
    }

    // Extract existing rel attribute if any
    const relMatch = attrs.match(/\brel=(["'])(.*?)\1/i);
    const targetMatch = attrs.match(/\btarget=(["'])(.*?)\1/i);

    let cleanAttrs = attrs;

    if (isLinkToSponsor) {
      if (relMatch) {
        cleanAttrs = cleanAttrs.replace(relMatch[0], 'rel="noopener noreferrer nofollow sponsored"');
      } else {
        cleanAttrs += ' rel="noopener noreferrer nofollow sponsored"';
      }
      if (!targetMatch) {
        cleanAttrs += ' target="_blank"';
      }
    } else {
      if (!relMatch) {
        cleanAttrs += ' rel="noopener noreferrer"';
      } else {
        // Strip out 'sponsored' if it was mistakenly attached to a non-commercial editorial link
        const existingRel = relMatch[2];
        if (existingRel.toLowerCase().includes('sponsored')) {
          const cleanedRel = existingRel
            .replace(/\bsponsored\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
          cleanAttrs = cleanAttrs.replace(relMatch[0], `rel="${cleanedRel || 'noopener noreferrer'}"`);
        }
      }
      if (!targetMatch) {
        cleanAttrs += ' target="_blank"';
      }
    }

    return `<a${cleanAttrs}>`;
  });
}

/**
 * Ensures all <img> tags inside HTML content have a descriptive, non-empty alt attribute.
 * Prevents search engine indexing errors and improves accessibility.
 */
export function ensureImageAlts(htmlContent: string, defaultAlt: string): string {
  if (!htmlContent) return '';
  const safeAlt = (defaultAlt || 'Article illustration')
    .replace(/"/g, '&quot;')
    .replace(/<[^>]*>/g, '')
    .trim();

  return htmlContent.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    const altMatch = attrs.match(/\balt=(["'])(.*?)\1/i);
    if (!altMatch) {
      return `<img${attrs} alt="${safeAlt}">`;
    } else if (!altMatch[2] || altMatch[2].trim() === '') {
      return `<img${attrs.replace(altMatch[0], `alt="${safeAlt}"`)}>`;
    }
    return match;
  });
}

/**
 * Recursively removes all undefined properties from objects and arrays,
 * while strictly preserving valid values such as false, 0, empty strings,
 * empty arrays, null, Date objects, and Firestore FieldValues (e.g. serverTimestamp).
 */
export function removeUndefined<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => removeUndefined(item)) as unknown as T;
  }

  // Check if plain object (avoid mutating Dates, Regexps, Blobs, Firestore FieldValues, etc.)
  if (typeof data === 'object') {
    const proto = Object.getPrototypeOf(data);
    const isPlain = proto === Object.prototype || proto === null;
    if (!isPlain) {
      return data;
    }

    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value);
      }
    }
    return cleaned as T;
  }

  return data;
}

/**
 * Formats and bounds an SEO meta description between 25 and 155 characters.
 * Ensures search engine crawlers (Google, Bing) never truncate snippets awkwardly
 * and prevents SEO audit flags for "Meta description too long or too short".
 */
export function formatMetaDescription(text: string | undefined | null, fallback = ''): string {
  const raw = text && text.trim().length > 0 ? text : fallback;
  const cleaned = (raw || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'In-depth reviews, comparisons, and guides on the latest AI tools and technology.';
  }

  if (cleaned.length <= 155) {
    if (cleaned.length < 25) {
      const padded = `${cleaned} — In-depth guide and tech analysis on TechNova AI.`;
      return padded.slice(0, 155);
    }
    return cleaned;
  }

  // Truncate cleanly at word boundary
  const sliced = cleaned.slice(0, 152);
  const lastSpace = sliced.lastIndexOf(' ');
  const safeStr = lastSpace > 115 ? sliced.slice(0, lastSpace) : sliced;
  return `${safeStr}...`;
}

