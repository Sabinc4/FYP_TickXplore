export type PageRangeItem = number | "...";

export const getPageRange = (current: number, total: number, max = 10): PageRangeItem[] => {
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const marker: PageRangeItem = "...";
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + max - 1);
  start = Math.max(1, end - max + 1);

  const range: PageRangeItem[] = [];
  if (start > 1) {
    range.push(1);
    if (start > 2) range.push(marker);
  }
  for (let p = start; p <= end; p++) range.push(p);
  if (end < total) {
    if (end < total - 1) range.push(marker);
    range.push(total);
  }
  return range;
};