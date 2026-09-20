// ============================================
// TechNova AI — Articles Data
// ============================================

const SITE_CONFIG = {
  name: 'TechNova AI',
  tagline: 'Discover, Compare & Master the Best AI & Tech Tools',
  description: 'Your go-to source for in-depth reviews, comparisons, and guides on the latest AI tools, software, and digital productivity solutions.',
  author: 'TechNova AI Team',
  url: 'https://technova-ai.vercel.app',
  year: 2026
};

const CATEGORIES = [
  {
    id: 'ai-tools',
    name: 'AI Tools',
    icon: '🤖',
    iconClass: 'category-card__icon--ai',
    description: 'Discover the latest artificial intelligence tools that are transforming how we work, create, and innovate.',
    count: 0
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '⚡',
    iconClass: 'category-card__icon--productivity',
    description: 'Boost your efficiency with the best productivity apps, project management tools, and workflow automators.',
    count: 0
  },
  {
    id: 'dev-tools',
    name: 'Dev Tools',
    icon: '💻',
    iconClass: 'category-card__icon--dev',
    description: 'Essential developer tools, IDEs, frameworks, and utilities for modern software development.',
    count: 0
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    iconClass: 'category-card__icon--design',
    description: 'Creative design tools, UI/UX platforms, and visual collaboration software for designers.',
    count: 0
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    icon: '🛡️',
    iconClass: 'category-card__icon--security',
    description: 'Stay protected with the best security tools, VPNs, password managers, and privacy solutions.',
    count: 0
  },
  {
    id: 'cloud',
    name: 'Cloud & SaaS',
    icon: '☁️',
    iconClass: 'category-card__icon--cloud',
    description: 'Cloud platforms, SaaS solutions, and infrastructure tools for businesses of all sizes.',
    count: 0
  }
];

const ARTICLES = [
  {
    id: 'claude-vs-chatgpt-2026',
    title: 'Claude 4 vs ChatGPT-5: The Ultimate AI Assistant Showdown (2026)',
    excerpt: 'We put the two most powerful AI assistants head-to-head in coding, writing, analysis, and creative tasks. The results might surprise you.',
    category: 'ai-tools',
    author: 'Alex Chen',
    authorInitial: 'A',
    date: '2026-09-15',
    readTime: '12 min read',
    rating: 4.8,
    featured: true,
    tags: ['AI', 'ChatGPT', 'Claude', 'Comparison', 'LLM'],
    image: '',
    content: `
      <p>The AI assistant landscape has evolved dramatically in 2026. With Anthropic's Claude 4 and OpenAI's ChatGPT-5 leading the pack, choosing the right AI companion has never been more important — or more difficult.</p>
      
      <p>In this comprehensive comparison, we've spent over 100 hours testing both models across real-world scenarios that matter most to professionals, developers, and creative minds.</p>

      <h2 id="overview">Overview & Pricing</h2>
      <p>Both platforms have matured significantly. Claude 4 introduces a 500K context window and improved reasoning capabilities, while ChatGPT-5 brings multimodal understanding to a new level with native video analysis and real-time web browsing.</p>
      
      <p>Claude 4 Pro is priced at $25/month, while ChatGPT-5 Plus costs $25/month. Both offer free tiers with limited usage, making them accessible for casual users.</p>

      <h2 id="coding">Coding Performance</h2>
      <p>This is where things get interesting. We tested both models on a variety of coding tasks, from simple scripts to complex full-stack applications.</p>
      
      <h3 id="coding-accuracy">Code Accuracy</h3>
      <p>Claude 4 excels at producing clean, well-structured code with thoughtful error handling. Its 500K context window means it can understand entire codebases at once, making refactoring and debugging significantly easier.</p>
      
      <p>ChatGPT-5, on the other hand, shines with its code execution environment and the ability to iteratively test and fix code in real-time. Its integration with GitHub Copilot creates a seamless development workflow.</p>

      <h2 id="writing">Writing Quality</h2>
      <p>For content creation, both models produce high-quality output, but with different strengths. Claude 4 tends to produce more nuanced, thoughtful prose that feels natural and well-researched. ChatGPT-5 is faster and more creative with brainstorming but can sometimes feel formulaic.</p>

      <h2 id="analysis">Data Analysis</h2>
      <p>ChatGPT-5's Advanced Data Analysis feature remains the gold standard for data science tasks. However, Claude 4's improved reasoning means it often catches subtle patterns and provides more insightful interpretations.</p>

      <h2 id="verdict">Final Verdict</h2>
      <p>If you're primarily a developer, Claude 4's massive context window and code quality give it the edge. For creative professionals and data analysts, ChatGPT-5's multimodal capabilities and tool integrations make it the stronger choice. For most users, either will serve exceptionally well — we're truly in the golden age of AI assistants.</p>
    `,
    pros: [
      'Claude 4: 500K context window is game-changing for developers',
      'ChatGPT-5: Superior multimodal capabilities',
      'Both offer competitive free tiers',
      'Claude 4: More nuanced and thoughtful responses',
      'ChatGPT-5: Better tool and plugin ecosystem'
    ],
    cons: [
      'Claude 4: No native code execution environment',
      'ChatGPT-5: Can feel formulaic in long-form writing',
      'Both require paid plans for full capabilities',
      'Claude 4: Slower response times on complex queries'
    ],
    ratingBreakdown: {
      overall: 4.8,
      label: 'Exceptional'
    }
  },
  {
    id: 'best-ai-code-editors-2026',
    title: '7 Best AI-Powered Code Editors in 2026: Beyond Copilot',
    excerpt: 'From Cursor to Windsurf to Zed AI — discover which AI code editor will supercharge your development workflow this year.',
    category: 'dev-tools',
    author: 'Sarah Kim',
    authorInitial: 'S',
    date: '2026-09-10',
    readTime: '15 min read',
    rating: 4.6,
    featured: false,
    tags: ['Dev Tools', 'AI', 'Code Editor', 'IDE', 'Cursor'],
    image: '',
    content: `
      <p>Gone are the days when code editors were simple text editors with syntax highlighting. In 2026, AI-powered code editors have become intelligent coding partners that understand your intent, suggest entire functions, and even debug your code autonomously.</p>

      <h2 id="top-picks">Our Top Picks</h2>
      <p>After extensive testing with real projects across Python, JavaScript, TypeScript, Rust, and Go, here are our top 7 AI code editors for 2026.</p>

      <h2 id="cursor">1. Cursor — Best Overall</h2>
      <p>Cursor continues to dominate the AI code editor space. Its "Composer" feature can now handle multi-file refactoring with remarkable accuracy, and the new agent mode can autonomously complete complex tasks across your entire codebase.</p>
      
      <h3 id="cursor-features">Key Features</h3>
      <p>Tab completion is nearly psychic, predicting not just the next line but entire code blocks based on context. The chat feature understands your project structure and can make changes across multiple files simultaneously.</p>

      <h2 id="windsurf">2. Windsurf — Best for Agents</h2>
      <p>Windsurf (formerly Codeium) has carved out a unique niche with its "Cascade" autonomous agent. Unlike other editors, Windsurf can independently research, plan, and implement features with minimal human intervention.</p>

      <h2 id="zed">3. Zed AI — Best Performance</h2>
      <p>Zed's Rust-based architecture makes it the fastest AI code editor on the market. With sub-millisecond keystroke latency even on massive codebases, it's the choice for developers who refuse to compromise on speed.</p>

      <h2 id="vscode">4. VS Code + Copilot — Best Ecosystem</h2>
      <p>The VS Code and GitHub Copilot combination remains unbeatable for ecosystem breadth. With access to thousands of extensions and deep integration with GitHub's development workflow, it's the safe choice for teams.</p>

      <h2 id="conclusion">Conclusion</h2>
      <p>The right AI code editor depends on your priorities. For pure AI capability, choose Cursor. For autonomous development, go with Windsurf. For speed, Zed is unmatched. And for ecosystem and team collaboration, VS Code + Copilot remains king.</p>
    `,
    pros: [
      'AI code editors dramatically boost productivity',
      'Most offer free tiers for individual developers',
      'Multi-file editing capabilities are game-changing',
      'Competition is driving rapid innovation'
    ],
    cons: [
      'Premium features require $20-40/month subscriptions',
      'AI suggestions can sometimes introduce subtle bugs',
      'Learning curve for agent-based workflows',
      'Privacy concerns with cloud-based code analysis'
    ],
    ratingBreakdown: {
      overall: 4.6,
      label: 'Excellent'
    }
  },
  {
    id: 'notion-vs-obsidian-2026',
    title: 'Notion vs Obsidian in 2026: Which Note-Taking App Wins?',
    excerpt: 'Two philosophies, one goal. We compare the cloud-first collaboration powerhouse against the local-first knowledge management system.',
    category: 'productivity',
    author: 'Mike Torres',
    authorInitial: 'M',
    date: '2026-09-05',
    readTime: '10 min read',
    rating: 4.5,
    featured: false,
    tags: ['Productivity', 'Notion', 'Obsidian', 'Note-Taking', 'Comparison'],
    image: '',
    content: `
      <p>The debate between Notion and Obsidian has been raging for years, and in 2026, both tools have evolved in fascinating directions. Notion has doubled down on AI and team collaboration, while Obsidian has perfected the art of local-first, interconnected note-taking.</p>

      <h2 id="philosophy">Different Philosophies</h2>
      <p>At their core, these tools represent two fundamentally different approaches to knowledge management. Notion believes your notes should live in the cloud, be collaborative, and integrate with your entire workflow. Obsidian believes your notes are yours — stored locally, linked like a second brain, and fully under your control.</p>

      <h2 id="features">Feature Comparison</h2>
      <p>Notion's AI features have matured significantly. You can now ask Notion AI to summarize entire databases, generate project plans from meeting notes, and even create automated workflows based on natural language descriptions.</p>
      
      <p>Obsidian counters with its unmatched graph view, local-first architecture, and an incredible plugin ecosystem that lets you customize every aspect of your workflow. The new Obsidian Canvas feature for visual thinking is particularly impressive.</p>

      <h2 id="pricing">Pricing</h2>
      <p>Obsidian is free for personal use with optional Sync ($5/mo) and Publish ($10/mo) services. Notion offers a generous free tier but charges $10/mo for the Plus plan and $18/mo for Business.</p>

      <h2 id="verdict">Who Should Choose What?</h2>
      <p>Choose Notion if you work in teams, need a single workspace for docs/projects/wikis, and love AI integration. Choose Obsidian if you value data ownership, love linking ideas, and want ultimate customization.</p>
    `,
    pros: [
      'Notion: Excellent for team collaboration',
      'Obsidian: Complete data ownership and privacy',
      'Notion: Powerful AI integration',
      'Obsidian: Incredible plugin ecosystem',
      'Both have generous free tiers'
    ],
    cons: [
      'Notion: Requires internet connection',
      'Obsidian: Steeper learning curve',
      'Notion: Can feel slow with large databases',
      'Obsidian: Collaboration features are limited'
    ],
    ratingBreakdown: {
      overall: 4.5,
      label: 'Excellent'
    }
  },
  {
    id: 'midjourney-v7-review',
    title: 'Midjourney V7 Review: Is It Still the King of AI Art?',
    excerpt: 'Midjourney V7 brings real-time generation, 3D modeling, and video — but can it maintain its crown against rising competitors?',
    category: 'ai-tools',
    author: 'Lisa Wang',
    authorInitial: 'L',
    date: '2026-08-28',
    readTime: '8 min read',
    rating: 4.7,
    featured: false,
    tags: ['AI', 'Midjourney', 'AI Art', 'Image Generation', 'Review'],
    image: '',
    content: `
      <p>Midjourney V7 represents the most ambitious update in the platform's history. Moving beyond static images, V7 introduces real-time generation, 3D asset creation, and short-form video generation — all while maintaining the aesthetic quality that made Midjourney famous.</p>

      <h2 id="whats-new">What's New in V7</h2>
      <p>The headline feature is real-time generation. As you type your prompt, Midjourney now shows a live preview that evolves with each word. It's mesmerizing to watch and dramatically speeds up the creative process.</p>

      <h2 id="image-quality">Image Quality</h2>
      <p>V7's image quality is stunning. The new model handles complex compositions, accurate text rendering, and photorealistic humans with unprecedented accuracy. Hands — the traditional weakness of AI art — are now nearly perfect.</p>

      <h2 id="3d-features">3D & Video</h2>
      <p>The new 3D generation feature can create textured, production-ready 3D models from text or image prompts. While not yet rivaling dedicated 3D software, it's a game-changer for rapid prototyping and concept art.</p>

      <h2 id="verdict">Verdict</h2>
      <p>Midjourney V7 isn't just an incremental update — it's a paradigm shift. The combination of real-time generation, 3D capabilities, and unmatched aesthetic quality firmly cements Midjourney's position as the king of AI art generation.</p>
    `,
    pros: [
      'Real-time generation is revolutionary',
      'Best-in-class image quality and aesthetics',
      'New 3D modeling capabilities',
      'Improved text rendering accuracy',
      'Intuitive web interface (no more Discord-only)'
    ],
    cons: [
      'Premium pricing at $30/month for Standard plan',
      '3D features still feel early-stage',
      'Video generation limited to 5 seconds',
      'No free tier available'
    ],
    ratingBreakdown: {
      overall: 4.7,
      label: 'Excellent'
    }
  },
  {
    id: 'best-vpn-2026',
    title: 'Best VPNs in 2026: Privacy, Speed & Security Tested',
    excerpt: 'We tested 15 VPN services for speed, security, streaming, and privacy. Here are the 5 that actually deliver on their promises.',
    category: 'security',
    author: 'James Park',
    authorInitial: 'J',
    date: '2026-08-20',
    readTime: '14 min read',
    rating: 4.4,
    featured: false,
    tags: ['Security', 'VPN', 'Privacy', 'Comparison', 'NordVPN'],
    image: '',
    content: `
      <p>In an era of increasing online surveillance and geo-restrictions, a reliable VPN is no longer optional — it's essential. But with dozens of VPN services all claiming to be the fastest, most secure, and most private, how do you choose?</p>

      <h2 id="methodology">Our Testing Methodology</h2>
      <p>We tested 15 popular VPN services over three months, measuring download speeds across 50 server locations, checking for DNS and WebRTC leaks, testing streaming compatibility with Netflix/Disney+/YouTube TV, and auditing their privacy policies.</p>

      <h2 id="top-pick">1. NordVPN — Best Overall</h2>
      <p>NordVPN continues to be our top pick in 2026. Its Meshnet feature, built-in threat protection, and consistently fast speeds make it the most well-rounded VPN available. The new NordWhisper protocol delivers impressive speeds even in heavily restricted regions.</p>

      <h2 id="runner-up">2. Mullvad — Best for Privacy</h2>
      <p>If privacy is your absolute priority, Mullvad is unmatched. They accept cash payments, require no email for signup, and have passed multiple independent audits. Their pricing is refreshingly simple: €5/month, no discounts, no upsells.</p>

      <h2 id="verdict">The Bottom Line</h2>
      <p>For most users, NordVPN offers the best balance of speed, security, and features. Privacy purists should look at Mullvad. And budget-conscious users will find excellent value in Surfshark.</p>
    `,
    pros: [
      'NordVPN: Excellent speed and feature set',
      'Mullvad: Unmatched privacy credentials',
      'All top picks passed independent security audits',
      'Prices as low as $2-3/month on long-term plans'
    ],
    cons: [
      'Monthly pricing is expensive ($12-15/month)',
      'Some VPNs slow down certain streaming services',
      'Mobile apps sometimes lag behind desktop versions',
      'Kill switch reliability varies by platform'
    ],
    ratingBreakdown: {
      overall: 4.4,
      label: 'Very Good'
    }
  },
  {
    id: 'figma-ai-features-review',
    title: 'Figma\'s New AI Features: A Designer\'s Honest Review',
    excerpt: 'Figma just launched a suite of AI-powered design tools. We put them to the test on real projects to see if they actually save time.',
    category: 'design',
    author: 'Emma Davis',
    authorInitial: 'E',
    date: '2026-08-15',
    readTime: '9 min read',
    rating: 4.3,
    featured: false,
    tags: ['Design', 'Figma', 'AI', 'UI/UX', 'Review'],
    image: '',
    content: `
      <p>Figma's integration of AI into its design workflow has been one of the most anticipated updates in the design community. After two months of daily use, here's our honest assessment of what works, what doesn't, and whether it's worth upgrading for.</p>

      <h2 id="ai-design">AI-Assisted Design</h2>
      <p>The standout feature is "Design with AI" — describe what you want, and Figma generates a complete UI component or layout. It understands design system constraints and can generate components that match your existing style guide.</p>

      <h2 id="auto-layout">Smart Auto-Layout</h2>
      <p>Figma's AI can now intelligently suggest and apply auto-layout to your designs. This is genuinely useful and saves significant time when building responsive layouts.</p>

      <h2 id="verdict">Worth the Upgrade?</h2>
      <p>If you're a professional designer working with Figma daily, the AI features are a solid productivity boost — especially the auto-layout and content generation features. However, don't expect AI to replace your design skills. It's a powerful assistant, not a replacement.</p>
    `,
    pros: [
      'AI component generation is surprisingly good',
      'Smart auto-layout saves significant time',
      'Respects existing design system constraints',
      'Seamless integration into existing workflow'
    ],
    cons: [
      'Only available on Organization plan ($45/editor/month)',
      'Generated designs still need manual refinement',
      'AI sometimes ignores accessibility best practices',
      'Limited to Figma ecosystem — no export to other tools'
    ],
    ratingBreakdown: {
      overall: 4.3,
      label: 'Very Good'
    }
  }
];

// Load custom articles from CMS (localStorage)
try {
  const customArticles = JSON.parse(localStorage.getItem('technova-custom-articles') || '[]');
  customArticles.forEach(article => {
    // Avoid duplicates
    if (!ARTICLES.find(a => a.id === article.id)) {
      ARTICLES.push(article);
    }
  });
} catch (e) {
  console.warn('Could not load custom articles:', e);
}

// Update category counts
CATEGORIES.forEach(cat => {
  cat.count = ARTICLES.filter(a => a.category === cat.id).length;
});

// ---- Helper Functions ---- //

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getArticlesByCategory(categoryId) {
  return ARTICLES.filter(a => a.category === categoryId);
}

function getFeaturedArticles() {
  return ARTICLES.filter(a => a.featured);
}

function getLatestArticles(count = 6) {
  return [...ARTICLES]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
}

function getArticleById(id) {
  return ARTICLES.find(a => a.id === id);
}

function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}

function searchArticles(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ARTICLES.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    a.tags.some(t => t.toLowerCase().includes(q)) ||
    a.category.toLowerCase().includes(q)
  );
}

function generateStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '½';
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) stars += '☆';
  return stars;
}

function generateArticleCardHTML(article, featured = false) {
  const category = getCategoryById(article.category);
  return `
    <article class="card ${featured ? 'card--featured' : ''}" onclick="navigateToArticle('${article.id}')">
      <div class="card__image">
        <div style="width:100%;height:100%;background:linear-gradient(135deg, ${getGradientForCategory(article.category)});display:flex;align-items:center;justify-content:center;font-size:${featured ? '4rem' : '3rem'}">
          ${category ? category.icon : '📄'}
        </div>
        <div class="card__image-overlay"></div>
        <span class="card__badge">${category ? category.name : ''}</span>
        <span class="card__rating">★ ${article.rating}</span>
      </div>
      <div class="card__body">
        <div class="card__meta">
          <span class="card__meta-item">📅 ${formatDate(article.date)}</span>
          <span class="card__meta-dot"></span>
          <span class="card__meta-item">⏱ ${article.readTime}</span>
        </div>
        <h3 class="card__title">${article.title}</h3>
        <p class="card__excerpt">${article.excerpt}</p>
        <div class="card__footer">
          <div class="card__author">
            <div class="card__author-avatar">${article.authorInitial}</div>
            <span class="card__author-name">${article.author}</span>
          </div>
          <span class="card__read-more">Read More →</span>
        </div>
      </div>
    </article>
  `;
}

function getGradientForCategory(categoryId) {
  const gradients = {
    'ai-tools': '#6C5CE7 0%, #A29BFE 50%, #6C5CE7 100%',
    'productivity': '#00D2FF 0%, #0099CC 50%, #00D2FF 100%',
    'dev-tools': '#00B894 0%, #00FF88 50%, #00B894 100%',
    'design': '#FF6B6B 0%, #FF8E8E 50%, #FF6B6B 100%',
    'security': '#FDCB6E 0%, #FFD700 50%, #FDCB6E 100%',
    'cloud': '#72EFDD 0%, #48C9B0 50%, #72EFDD 100%'
  };
  return gradients[categoryId] || '#6C5CE7 0%, #A29BFE 100%';
}

function navigateToArticle(articleId) {
  window.location.href = `article.html?id=${articleId}`;
}

function navigateToCategory(categoryId) {
  window.location.href = `category.html?id=${categoryId}`;
}
