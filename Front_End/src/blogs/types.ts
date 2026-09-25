export interface BlogSectionItem {
  title: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  tagline: string;
  heroImage: string;
  intro: string;
  overview: string;
  history?: string;
  attractions: BlogSectionItem[];
  thingsToDo: string[];
  bestTimeToVisit: string;
  howToGetThere: string[];
  accommodation?: string;
  foodExperiences?: string;
  travelTips: string[];
  quickFacts?: string[];
  pickupPoint?: string;
  dropPoint?: string;
}