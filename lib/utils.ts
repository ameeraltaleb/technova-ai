// TechNova AI — Utility Functions

// Curated tech-related images from Unsplash organized by category pools
// Over 80+ distinct high-resolution photos categorized by domain
const AI_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop&q=80', // AI concept
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop&q=80', // AI humanoid robot
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=450&fit=crop&q=80', // Neural wave
  'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&h=450&fit=crop&q=80', // Glowing processor
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop&q=80', // Matrix connections
  'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=450&fit=crop&q=80', // Neural networks purple
  'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&h=450&fit=crop&q=80', // Generative landscape
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=450&fit=crop&q=80', // Neon 3D neural cube
  'https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=800&h=450&fit=crop&q=80', // Deep learning stream
  'https://images.unsplash.com/photo-1680795456475-47043818e690?w=800&h=450&fit=crop&q=80', // Generative sphere
  'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?w=800&h=450&fit=crop&q=80', // Machine intelligence
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=450&fit=crop&q=80', // AI interface
];

const SECURITY_IMAGES = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop&q=80', // Cybersecurity city
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop&q=80', // Padlock circuit
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop&q=80', // Matrix green code
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&fit=crop&q=80', // Shield security lock
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=450&fit=crop&q=80', // Cyber lock concept
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=450&fit=crop&q=80', // Digital security wireframe
  'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&h=450&fit=crop&q=80', // Terminal hacker screen
  'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&h=450&fit=crop&q=80', // Fingerprint biometric
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop&q=80', // Dark hacker laptop
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop&q=80', // Secure data center
];

const DEV_IMAGES = [
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop&q=80', // Code editor
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop&q=80', // Code terminal
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop&q=80', // React code
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop&q=80', // Syntax highlighted editor
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop&q=80', // MacBook workstation
  'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=450&fit=crop&q=80', // Mechanical keyboard typing
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop&q=80', // Developer desk & coffee
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=450&fit=crop&q=80', // HTML CSS JS code
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=450&fit=crop&q=80', // Python code
  'https://images.unsplash.com/photo-1537432376769-00f5c244c8d8?w=800&h=450&fit=crop&q=80', // Dark VS Code
];

const CLOUD_IMAGES = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop&q=80', // Data globe
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=450&fit=crop&q=80', // Server rack datacenter
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop&q=80', // Network switches
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&h=450&fit=crop&q=80', // Cloud architecture
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop&q=80', // Silicon processor
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop&q=80', // Connected tech
  'https://images.unsplash.com/photo-1520869562399-e772f042f422?w=800&h=450&fit=crop&q=80', // Fiber optics
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=450&fit=crop&q=80', // Cloud computing
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=450&fit=crop&q=80', // Glowing motherboard
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop&q=80', // Modern engineering
];

const DESIGN_IMAGES = [
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop&q=80', // Design tools tablet
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=450&fit=crop&q=80', // Wireframes
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=450&fit=crop&q=80', // UI sketching
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=450&fit=crop&q=80', // Design mockup team
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&h=450&fit=crop&q=80', // Minimal workspace
  'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=450&fit=crop&q=80', // Figma UI on screen
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=450&fit=crop&q=80', // Color swatches
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=450&fit=crop&q=80', // Geometric typography
  'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=450&fit=crop&q=80', // Spatial 3D UI
  'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=450&fit=crop&q=80', // Graphic UI tablet
];

const PRODUCTIVITY_IMAGES = [
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop&q=80', // Notes & task planner
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop&q=80', // Minimalist laptop desk
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop&q=80', // Deep work session
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=450&fit=crop&q=80', // Modern tech office
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop&q=80', // Analytics dashboard
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=450&fit=crop&q=80', // Agile sprint board
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop&q=80', // Team collaboration
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=450&fit=crop&q=80', // Executive quarterly review
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop&q=80', // Glass skyscraper
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=450&fit=crop&q=80', // Creative workflow
];

const CRYPTO_IMAGES = [
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop&q=80', // Ethereum 3D token
  'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&h=450&fit=crop&q=80', // Bitcoin macro
  'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&h=450&fit=crop&q=80', // Decentralized network
  'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=450&fit=crop&q=80', // Crypto charts wallet
  'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=450&fit=crop&q=80', // DeFi graphic
  'https://images.unsplash.com/photo-1622979135240-caa6648190b6?w=800&h=450&fit=crop&q=80', // Trading candlesticks
  'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=450&fit=crop&q=80', // Smart contracts
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop&q=80', // Stock ticker
  'https://images.unsplash.com/photo-1639762680489-97693005a3aa?w=800&h=450&fit=crop&q=80', // Digital blockchain
  'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=450&fit=crop&q=80', // Crypto digital art
];

const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  'ai-tools': AI_IMAGES,
  'machine-learning': AI_IMAGES,
  'deep-dives': AI_IMAGES,
  'security': SECURITY_IMAGES,
  'programming': DEV_IMAGES,
  'dev-tools': DEV_IMAGES,
  'cloud': CLOUD_IMAGES,
  'technology': CLOUD_IMAGES,
  'design': DESIGN_IMAGES,
  'productivity': PRODUCTIVITY_IMAGES,
  'industry': PRODUCTIVITY_IMAGES,
  'tutorials': PRODUCTIVITY_IMAGES,
  'reviews': PRODUCTIVITY_IMAGES,
  'crypto': CRYPTO_IMAGES,
};

/**
 * Returns the article's image URL, or a consistent domain-relevant placeholder
 * based on the article's specific category and unique ID hash.
 */
export function getArticleImage(article: { image?: string; id?: string; category?: string }): string {
  if (article.image && article.image.trim() !== '') return article.image;

  const id = article.id || 'article';
  const category = (article.category || '').toLowerCase().trim();
  const pool = CATEGORY_IMAGE_POOLS[category] || AI_IMAGES;

  // Generate a weighted, consistent index from the article ID
  const hash = id.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
  return pool[Math.abs(hash) % pool.length];
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

/**
 * Formats and bounds an SEO page title strictly under 70 characters (recommended: <= 65 chars).
 * Prevents search engines (Google, Bing) from truncating titles with ellipsis in SERPs.
 * Preserves core keywords, smartly formats subtitle colons, and avoids trailing conjunctions.
 */
export function formatMetaTitle(
  rawTitle: string | undefined | null,
  maxLen = 65,
  siteBrand = 'TechNova AI'
): string {
  if (!rawTitle || !rawTitle.trim()) {
    return 'TechNova AI — Discover & Compare The Best AI Tools';
  }

  // Remove existing brand or trailing dashes/pipes
  let clean = rawTitle
    .replace(/\s*[|—–-]\s*TechNova(\s*AI)?\s*$/i, '')
    .trim();

  // 1. If clean title + full site brand fits within maxLen
  const fullWithBrand = `${clean} | ${siteBrand}`;
  if (fullWithBrand.length <= maxLen) {
    return fullWithBrand;
  }

  // 2. If clean title + short brand fits within maxLen
  const shortBrand = siteBrand.replace(/\s*AI$/i, '').trim();
  const fullWithShortBrand = `${clean} | ${shortBrand}`;
  if (fullWithShortBrand.length <= maxLen) {
    return fullWithShortBrand;
  }

  // 3. If clean title itself fits within maxLen, preserve full title context
  if (clean.length <= maxLen) {
    return clean;
  }

  // 4. If title has a colon/sub-title (e.g. "Main Topic: Detailed Subtitle"):
  if (clean.includes(':')) {
    const parts = clean.split(':');
    const prefix = parts[0].trim();
    if (prefix.length >= 20) {
      const prefixWithBrand = `${prefix} | ${siteBrand}`;
      if (prefixWithBrand.length <= maxLen) {
        return prefixWithBrand;
      }
      if (prefix.length <= maxLen) {
        return prefix;
      }
    }
  }

  // 5. Cleanly bound at word boundary to never cut mid-word
  const words = clean.split(/\s+/);
  let truncated = '';
  for (const word of words) {
    const candidate = truncated ? `${truncated} ${word}` : word;
    if (candidate.length <= maxLen) {
      truncated = candidate;
    } else {
      break;
    }
  }

  // Strip trailing punctuation and dangling conjunctions/prepositions
  truncated = truncated
    .replace(/[,:;—–-]\s*$/, '')
    .replace(/\b(and|or|the|to|in|of|for|with|a|an|by)\s*$/i, '')
    .trim();

  return truncated || clean.slice(0, maxLen);
}


