import type { Accommodation } from "../data/accommodations";
import AccommodationCard from "./AccommodationCard";
import SkeletonCard from "../Component/SkeletonCard";

interface AccommodationGridProps {
  accommodations: Accommodation[];
  loading: boolean;
  layout: "grid" | "list";
  nights: number;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

const AccommodationGrid = ({
  accommodations,
  loading,
  layout,
  nights,
  favorites,
  onToggleFavorite,
}: AccommodationGridProps) => {
  if (loading) {
    return layout === "grid" ? (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    ) : (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return layout === "grid" ? (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {accommodations.map((acc, index) => (
        <div key={acc.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
          <AccommodationCard
            accommodation={acc}
            layout="grid"
            nights={nights}
            isFavorite={favorites.has(acc.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      {accommodations.map((acc) => (
        <AccommodationCard
          key={acc.id}
          accommodation={acc}
          layout="list"
          nights={nights}
          isFavorite={favorites.has(acc.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default AccommodationGrid;