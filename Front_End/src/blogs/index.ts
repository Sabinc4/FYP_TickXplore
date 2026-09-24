import type { BlogPost } from "./types";
import chitwan from "./chitwan";
import poonHill from "./poon-hill";
import nagarkot from "./nagarkot";
import mustang from "./mustang";
import pokhara from "./pokhara";
import langtang from "./langtang";
import ghandruk from "./ghandruk";
import rara from "./rara";
import sheyPhoksundo from "./shey-phoksundo";
import tilichoLake from "./tilicho-lake";
import kalinchok from "./kalinchok";
import namoBuddha from "./namo-buddha";

export const BLOG_POSTS: BlogPost[] = [
  chitwan,
  poonHill,
  nagarkot,
  mustang,
  pokhara,
  langtang,
  ghandruk,
  rara,
  sheyPhoksundo,
  tilichoLake,
  kalinchok,
  namoBuddha,
];

const TITLE_ALIASES: Record<string, string> = {
  "chitwan national park": "chitwan",
  chitwan: "chitwan",
  "poon hill": "poon-hill",
  "pooon hill": "poon-hill",
  nagarkot: "nagarkot",
  "upper mustang": "mustang",
  mustang: "mustang",
  pokhara: "pokhara",
  "langtang valley": "langtang",
  langtang: "langtang",
  ghandruk: "ghandruk",
  "rara lake": "rara",
  rara: "rara",
  "shey phoksundo": "shey-phoksundo",
  "shey phoksundo lake": "shey-phoksundo",
  "phoksundo lake": "shey-phoksundo",
  phoksundo: "shey-phoksundo",
  "tilicho lake": "tilicho-lake",
  tilicho: "tilicho-lake",
  "tilico lake": "tilicho-lake",
  kalinchok: "kalinchok",
  kalinchowk: "kalinchok",
  kuri: "kalinchok",
  "namo buddha": "namo-buddha",
};

const slugify = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getBlogBySlug = (slug: string): BlogPost | undefined =>
  BLOG_POSTS.find((post) => post.slug === slug);

export const slugForTitle = (title: string): string | undefined => {
  const key = title.trim().toLowerCase();
  if (TITLE_ALIASES[key]) return TITLE_ALIASES[key];
  const fallback = slugify(title);
  return BLOG_POSTS.some((post) => post.slug === fallback) ? fallback : undefined;
};