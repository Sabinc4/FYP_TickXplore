import { useRouteError, Link } from "react-router-dom";

export default function NoPage() {
  const error = useRouteError();
  const isNotFound = (error as { status?: number })?.status === 404;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-black text-blue-600">404</p>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">
        {isNotFound ? "Page Not Found" : "Something went wrong"}
      </h2>
      <p className="mt-2 max-w-md text-slate-500">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get
        you back on track.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}