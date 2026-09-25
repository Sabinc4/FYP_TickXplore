import { useState } from "react";

/**
 * Image with a graceful local fallback so the page still looks decent
 * when remote (Unsplash) photography can't be loaded (e.g. offline).
 */
const FALLBACK_IMAGE = "/Pictures/Pokhara.jpeg";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

const SmartImage = ({ src, alt, className, fallback = FALLBACK_IMAGE }: SmartImageProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? fallback : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export default SmartImage;