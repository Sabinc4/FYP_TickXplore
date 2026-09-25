import { useEffect, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";

interface ScrollToTopButtonProps {
  /** Scroll container to watch/scroll. Defaults to the window (public pages). */
  scrollTarget?: RefObject<HTMLElement | null>;
  /** Extra classes to override the default positioning. */
  className?: string;
}

const SCROLL_THRESHOLD = 320;

const ScrollToTopButton = ({ scrollTarget, className = "" }: ScrollToTopButtonProps) => {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const el = scrollTarget?.current || window;

    const onScroll = () => {
      const top = el === window ? window.scrollY : (el as HTMLElement).scrollTop;
      setVisible(top > SCROLL_THRESHOLD);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollTarget]);

  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  const scrollToTop = () => {
    const el = scrollTarget?.current;
    const target = el || window;
    target.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Scroll to top"
      aria-label="Scroll to top"
      className={`fixed bottom-20 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white shadow-card-lg transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 lg:bottom-6 lg:right-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      } ${className}`}
    >
      <FaArrowUp size={18} />
    </button>
  );
};

export default ScrollToTopButton;