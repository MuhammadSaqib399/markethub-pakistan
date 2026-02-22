import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 px-4">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-green-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm"
          >
            Go Home
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
