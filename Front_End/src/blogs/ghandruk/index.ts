import type { BlogPost } from "../types";
import Ghandruk from "/Pictures/Ghandruk.jpeg";

const post: BlogPost = {
  slug: "ghandruk",
  title: "Ghandruk",
  tagline: "Traditional Gurung village with mountain views",
  heroImage: Ghandruk,
  intro:
    "Ghandruk is a picture-perfect Gurung village set on a hillside beneath the Annapurnas, where slate-roofed stone houses, blooming rhododendrons and warm mountain hospitality combine for one of Nepal's most charming cultural stays.",
  overview:
    "Perched at 2,012 metres above the Modi Khola river, Ghandruk is a key crossroads on the Annapurna trekking routes. Its cobbled lanes, prayer wheels, and the Annapurnas rising straight ahead make it a favourite stop for hikers — and an easy cultural destination on its own for those seeking tradition without the long trek.",
  history:
    "Ghandruk is one of the oldest Gurung settlements in the region. The Gurungs, famed as legendary Gurkha soldiers, have lived here for generations, and the village proudly preserves its customs. A small museum in the village documents Gurung culture, homes, and military history.",
  attractions: [
    {
      title: "Annapurna South Viewpoint",
      description:
        "Stand on the village ridge for unobstructed views of Annapurna South, Hiunchuli, Machapuchare and Gangapurna.",
    },
    {
      title: "Gurung Museum",
      description:
        "Browse artefacts, traditional homes and exhibits telling the story of Gurung life and the Gurkha legacy.",
    },
    {
      title: "Terraced Villages & Temples",
      description:
        "Wander past slate-and-stone houses, gompas and Hindu temples that share the hillside in quiet harmony.",
    },
    {
      title: "Rhododendron Trails",
      description:
        "In spring, the forests around the village blaze with scarlet and pink rhododendron blossoms.",
    },
  ],
  thingsToDo: [
    "Wake early for the sunrise over Annapurna South",
    "Explore the Gurung Museum and traditional houses",
    "Walk the village trails between terraced fields and viewpoints",
    "Join a homestay dinner to learn Gurung cooking and culture",
    "Continue the scenic trail to Poon Hill or Tadapani",
  ],
  bestTimeToVisit:
    "October to November and March to April bring the clearest views, with April adding rhododendron bloom. December–February is cold but bright.",
  howToGetThere: [
    "Take a bus or private jeep from Pokhara to Nayapul, then trek the 2–3 hour uphill path to the village.",
    "Trek from Pokhara via Kimche or from Ghorepani/Poon Hill as part of the Annapurna loop.",
    "Hire a jeep directly to Ghandruk from Pokhara on the motorable road.",
  ],
  accommodation:
    "A growing number of Gurung homestays and guesthouses offer warm rooms, traditional meals and authentic village hospitality.",
  foodExperiences:
    "Taste homemade Gurung cuisine — millet dal, fermented vegetables (gundruk), buckwheat pancakes and raksi, the local millet liquor served warm.",
  travelTips: [
    "Ask locals before photographing homes or people",
    "Carry some cash — homestays rarely accept cards",
    "Dress modestly and respectfully in this living village",
    "Book homestays ahead during peak trekking season",
    "Bring warm layers; nights at 2,000 m are cool",
  ],
  quickFacts: [
    "Elevation: 2,012 m (6,601 ft)",
    "People: Gurung community",
    "On the route to: Poon Hill and Annapurna Base Camp",
    "Iconic view: Annapurna South & Machapuchare",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Ghandruk",
};

export default post;