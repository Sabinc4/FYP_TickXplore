import type { BlogPost } from "../types";
import Langtang from "/Pictures/Langtang.jpeg";

const post: BlogPost = {
  slug: "langtang",
  title: "Langtang Valley",
  tagline: "Scenic trekking through a serene alpine valley",
  heroImage: Langtang,
  intro:
    "Langtang Valley is the Himalaya's hidden gem — a glacial alpine valley of yaks, Tamang villages and towering peaks, only hours from Kathmandu yet worlds apart in serenity.",
  overview:
    "Lying on the border of Nepal and Tibet, the Langtang Valley trek leads through rhododendron and bamboo forests, past peaceful Buddhist villages, to the frozen lakes of Kyanjin Gompa beneath Langtang Lirung (7,227 m). It is considered one of Nepal's best treks for its blend of culture, scenery and accessibility.",
  history:
    "Langtang takes its name from the Tibetan yak (lang). The valley was historically a trade route connecting the Kathmandu valley with Tibet's southern plateaus. In 2015, a devastating avalanche hit the valley during the Gorkha earthquake; resilient communities and lodges have since rebuilt, welcoming trekkers home once more.",
  attractions: [
    {
      title: "Kyanjin Gompa & Cheese Factory",
      description:
        "Stay at the trail's end village, visit its ancient gompa, and taste local yak cheese from the community factory.",
    },
    {
      title: "Kyanjin Ri Viewpoint",
      description:
        "Climb to 4,773 metres for a commanding panorama of Langtang Lirung, Kimshung and the icy Tibetan border peaks.",
    },
    {
      title: "Langtang Village & Monasteries",
      description:
        "Visit the rebuilt stone village and its monasteries — a moving story of recovery amid the mountains.",
    },
    {
      title: "Tamang Culture & Yak Herds",
      description:
        "Walk alongside Tibetan-speaking Tamang herders, prayer walls and mani stones that line the valley floor.",
    },
    {
      title: "Glaciers & Tserko Ri",
      description:
        "Extend the trek to Tserko Ri (4,984 m) for close-up views of the Langtang glacier and icefall.",
    },
  ],
  thingsToDo: [
    "Trek the classic valley route from Syabrubesi to Kyanjin Gompa",
    "Watch sunrise from Kyanjin Ri or Tserko Ri",
    "Sample fresh yak cheese at the village factory",
    "Visit restored monasteries and mani walls throughout the villages",
    "Photograph glacial lakes and icefalls above Kyanjin",
  ],
  bestTimeToVisit:
    "October to December offers crisp clear days, while March to May brings blooming rhododendrons. Skip the monsoon (June–September) for trail accessibility.",
  howToGetThere: [
    "Take a local bus from Kathmandu to Syabrubesi (about 7–8 hours via Dhunche).",
    "Hire a private jeep from Kathmandu to Syabrubesi — a faster 5–6 hour option.",
    "Begin trekking from Syabrubesi through Bambu and Ghodatabela to Lama Hotel and beyond.",
  ],
  accommodation:
    "Classic trekking teahouses offer shared rooms, warm dal bhat and hot drinks at every stage from Bambu to Kyanjin Gompa.",
  foodExperiences:
    "Feast on dal bhat, chapati, and Tibetan staples like momos and thukpa in family-run lodges, and don't miss the fresh yak cheese at Kyanjin.",
  travelTips: [
    "Gain altitude slowly — Kyanjin Gompa sits at 3,870 m",
    "Pack warm layers even in summer; nights are cold at altitude",
    "Support the rebuilt lodges — your stay helps valley recovery",
    "Carry a power bank; electricity can be scarce above Lama Hotel",
    "Consider adding a rest day at Kyanjin to explore the side trails",
  ],
  quickFacts: [
    "Highest point (Kyanjin Ri): 4,773 m",
    "Main peak: Langtang Lirung (7,227 m)",
    "Trek duration: 5–7 days round trip",
    "Nearest roadhead: Syabrubesi",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Langtang",
};

export default post;