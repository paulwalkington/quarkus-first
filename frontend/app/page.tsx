import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Fleet Manager</h1>
      <p className="text-gray-500 mb-10">Manage your lorries and cars inventory.</p>
      <div className="flex justify-center gap-6">
        <Link
          href="/lorries"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View Lorries
        </Link>
        <Link
          href="/cars"
          className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          View Cars
        </Link>
      </div>
    </div>
  );
}
