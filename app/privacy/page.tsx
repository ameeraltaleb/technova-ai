import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — TechNova AI',
  description: 'Read about how TechNova AI collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <>
      <section className="category-hero">
        <div className="container">
          <div className="article__breadcrumb">
            <Link href="/">Home</Link> <span>/</span>
            <span>Privacy Policy</span>
          </div>
          <h1 className="category-hero__title">Privacy Policy</h1>
          <p className="category-hero__description">Last updated: September 28, 2026</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container container--narrow">
          <div className="article-content" style={{ maxWidth: '800px' }}>

            <h2>1. Introduction</h2>
            <p>Welcome to TechNova AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>technova-ai.online</strong> (the &quot;Site&quot;).</p>
            <p>By using our Site, you consent to the data practices described in this policy. If you do not agree with the terms, please discontinue use of the Site.</p>

            <h2>2. Information We Collect</h2>
            <h3>Information You Provide</h3>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, and message content when you use our contact form.</li>
              <li><strong>Newsletter Subscription:</strong> Email address when you subscribe to our newsletter.</li>
              <li><strong>Comments:</strong> Information you provide when leaving comments on articles.</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <ul>
              <li><strong>Device Information:</strong> Browser type, operating system, device type, and screen resolution.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, and referral sources.</li>
              <li><strong>IP Address:</strong> Your Internet Protocol address (anonymized where possible).</li>
              <li><strong>Cookies:</strong> Small data files stored on your device to enhance your browsing experience.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To operate, maintain, and improve our website and content.</li>
              <li>To respond to your inquiries and provide customer support.</li>
              <li>To send newsletters and updates (only with your explicit consent).</li>
              <li>To analyze website traffic and user behavior to improve user experience.</li>
              <li>To display relevant advertisements through third-party ad networks.</li>
              <li>To detect, prevent, and address technical issues and security threats.</li>
            </ul>

            <h2>4. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the Site to function properly (e.g., theme preferences).</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Site (e.g., Google Analytics).</li>
              <li><strong>Advertising Cookies:</strong> Used by third-party ad networks to serve relevant advertisements.</li>
            </ul>
            <p>You can manage your cookie preferences through your browser settings. Disabling cookies may affect certain features of the Site.</p>

            <h2>5. Third-Party Services</h2>
            <p>We may use third-party services that collect, monitor, and analyze data:</p>
            <ul>
              <li><strong>Google Analytics:</strong> For website traffic analysis.</li>
              <li><strong>Google AdSense:</strong> For displaying advertisements.</li>
              <li><strong>Social Media Platforms:</strong> For sharing functionality and embedded content.</li>
            </ul>
            <p>Each third-party service has its own privacy policy. We encourage you to review their policies.</p>

            <h2>6. Data Sharing and Disclosure</h2>
            <p>We do <strong>not</strong> sell your personal information. We may share your data only in the following circumstances:</p>
            <ul>
              <li>With service providers who assist in operating the Site (hosting, analytics).</li>
              <li>When required by law or to comply with legal obligations.</li>
              <li>To protect our rights, property, or safety, or that of our users.</li>
              <li>In connection with a business transfer (merger, acquisition, or sale of assets).</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>We retain personal data only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law. Analytics data is retained for up to 26 months.</p>

            <h2>8. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format.</li>
            </ul>
            <p>To exercise any of these rights, please contact us at the information provided below.</p>

            <h2>9. Children&apos;s Privacy</h2>
            <p>Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.</p>

            <h2>10. Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>

            <h2>11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. We encourage you to review this page periodically.</p>

            <h2>12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> privacy@technova-ai.online</li>
              <li><strong>Contact Form:</strong> <Link href="/about#contactForm" style={{ color: 'var(--text-link)' }}>About Page</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
