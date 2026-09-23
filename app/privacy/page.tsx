import Link from 'next/link';

export default function StaticPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
      <h1>Page Content Coming Soon</h1>
      <Link href="/" style={{ color: 'var(--text-link)' }}>Return Home</Link>
    </div>
  );
}
