import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — TechNova AI',
  description: 'Read the Terms of Service for using the TechNova AI website.',
};

export default function TermsPage() {
  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Terms of Service</span>
          </div>
          <h1 className="category-hero__title">Terms of Service</h1>
          <p className="category-hero__description">Last updated: September 28, 2026</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container container--narrow">
          <div className="article-content" style={{ maxWidth: '800px' }}>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using the TechNova AI website (&quot;Site&quot;), you accept and agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must not use the Site.</p>

            <h2>2. Description of Service</h2>
            <p>TechNova AI is a technology review and content publication platform that provides articles, reviews, comparisons, guides, and a tools directory related to software, AI tools, developer tools, and related technologies. All content is provided for informational purposes only.</p>

            <h2>3. Intellectual Property</h2>
            <p>All content on this Site — including but not limited to text, graphics, logos, images, audio, video, and software — is the property of TechNova AI or its content suppliers and is protected by international copyright laws.</p>
            <ul>
              <li>You may not reproduce, distribute, modify, or create derivative works of our content without prior written consent.</li>
              <li>You may share links to our articles and quote brief excerpts for non-commercial purposes with proper attribution.</li>
              <li>All trademarks, product names, and logos mentioned in reviews belong to their respective owners.</li>
            </ul>

            <h2>4. User Conduct</h2>
            <p>When using our Site, you agree not to:</p>
            <ul>
              <li>Use the Site for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
              <li>Transmit malware, viruses, or any other harmful code.</li>
              <li>Scrape, crawl, or harvest content from the Site without written permission.</li>
              <li>Post spam, misleading, or harmful content in comments or contact forms.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation.</li>
            </ul>

            <h2>5. Reviews and Opinions</h2>
            <p>The reviews, ratings, and opinions published on TechNova AI represent the views of our editorial team based on hands-on testing at the time of publication.</p>
            <ul>
              <li>Ratings and recommendations are subjective and may change as products evolve.</li>
              <li>We strive for accuracy but do not guarantee that all information is complete or current.</li>
              <li>Our reviews are independent. We clearly disclose any affiliate relationships or sponsored content.</li>
            </ul>

            <h2>6. Affiliate Links and Advertising</h2>
            <p>TechNova AI may contain affiliate links to third-party products. When you click these links and make a purchase, we may earn a small commission at no additional cost to you. This revenue helps support our independent review process.</p>
            <p>We also display advertisements through third-party ad networks (such as Google AdSense). The presence of ads does not constitute an endorsement of the advertised products.</p>

            <h2>7. Third-Party Links</h2>
            <p>Our Site contains links to external websites and services. We are not responsible for the content, privacy policies, or practices of any third-party sites. You access external links at your own risk.</p>

            <h2>8. Disclaimer of Warranties</h2>
            <p>The Site and its content are provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, either express or implied, including but not limited to:</p>
            <ul>
              <li>Warranties of merchantability or fitness for a particular purpose.</li>
              <li>Warranties that the Site will be uninterrupted, secure, or error-free.</li>
              <li>Warranties regarding the accuracy or reliability of any content.</li>
            </ul>

            <h2>9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by applicable law, TechNova AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of your use of or inability to use the Site.</p>

            <h2>10. Indemnification</h2>
            <p>You agree to indemnify and hold harmless TechNova AI and its team from any claims, losses, liabilities, damages, costs, or expenses (including attorneys&apos; fees) arising from your use of the Site or violation of these Terms.</p>

            <h2>11. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Site. Your continued use of the Site after changes are posted constitutes acceptance of the revised Terms.</p>

            <h2>12. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with applicable international laws. Any disputes arising under these Terms shall be resolved through binding arbitration or in the courts of the applicable jurisdiction.</p>

            <h2>13. Contact</h2>
            <p>For questions about these Terms of Service, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> legal@technova-ai.online</li>
              <li><strong>Contact Form:</strong> <Link href="/about#contactForm" style={{ color: 'var(--text-link)' }}>About Page</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
