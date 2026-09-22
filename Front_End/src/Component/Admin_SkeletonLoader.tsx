interface SkeletonLoaderProps {
  type: "card" | "table";
}

const SkeletonLoader = ({ type }: SkeletonLoaderProps) => {
  if (type === "card") {
    return (
      <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="h-48 w-full bg-gray-200" />
        <div className="space-y-3 p-4">
          <div className="h-6 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="space-y-4">
        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;