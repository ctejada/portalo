import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-page-title">404</h1>
        <p className="text-body text-text-secondary">
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block text-body text-accent hover:text-accent-hover"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
