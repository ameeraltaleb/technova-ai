import './admin.css';

export const metadata = {
  title: 'Admin Console',
  description: 'TechNova AI content management and monetization admin dashboard.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
