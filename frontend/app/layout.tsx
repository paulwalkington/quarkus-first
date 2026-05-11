import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fleet Manager',
  description: 'Manage lorries and cars',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 flex items-center gap-8 h-14">
            <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600">
              Fleet Manager
            </Link>
            <Link href="/lorries" className="text-sm text-gray-600 hover:text-blue-600 font-medium">
              Lorries
            </Link>
            <Link href="/cars" className="text-sm text-gray-600 hover:text-blue-600 font-medium">
              Cars
            </Link>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
