import type { BlogPost } from "../types";
import SheyPhoksundo from "/Pictures/Shey_Phoksundo.jpeg";

const post: BlogPost = {
  slug: "shey-phoksundo",
  title: "Shey Phoksundo Lake",
  tagline: "Turquoise alpine lake at Nepal's largest park",
  heroImage: SheyPhoksundo,
  intro:
    "Shey Phoksundo is a shimmering turquoise lake locked in the far-western highlands, the centrepiece of Nepal's largest national park and one of the world's deepest — a place of breathtaking blue water, banded cliffs and ancient Bon monasteries.",
  overview:
    "At 3,611 metres, Shey Phoksundo Lake stretches 5 kilometres in vivid blue between dense cliffs near the village of Ringmo in Dolpo. It lies at the heart of Shey Phoksundo National Park, a wilderness of Himalayan peaks, blue sheep, and the last living villages of Bon — Nepal's pre-Buddhist religion.",
  history:
    "Dolpo, isolated behind the Dhaulagiri massif, kept its Tibetan heritage intact for centuries. The lakeside Bon monasteries, including the renowned Tshowa Gompa, are among the oldest in the Himalaya. The lake itself is sacred; locals believe it is the dwelling of a lake goddess.",
  attractions: [
    {
      title: "The Turquoise Lake",
      description:
        "Walk its shore and watch the colour of the water shift from deep blue to turquoise as the cliffs and sky change.",
    },
    {
      title: "Ringmo Village",
      description:
        "Visit the stone village perched above the lake, built on ancient landslide terraces, home to Bon-po families.",
    },
    {
      title: "Tshowa Bon Monastery",
      description:
        "Explore one of the last practising Bon monasteries in the world, its murals and stone chortens steeped in history.",
    },
    {
      title: "Phoksundo Waterfall",
      description:
        "Photograph the dramatic Suligad waterfall (one of Nepal's highest) on the approach trail just below the lake.",
    },
    {
      title: "Blue Sheep & Wildlife Trails",
      description:
        "Trek above the lake to spot bharal (blue sheep), Himalayan griffons and, if lucky, the elusive snow leopard.",
    },
  ],
  thingsToDo: [
    "Hike the lakeshore trail between the cliffs and gravel terraces",
    "Circumnavigate the lake over two relaxed days",
    "Join monks and locals for the annual lake circumambulation if visiting during a festival",
    "Explore the side valley of Thakto Khola High Pass",
    "Photograph the Phoksundo waterfall on the access trail",
  ],
  bestTimeToVisit:
    "May–September is the trekking window; June and September balance warmth and trail conditions. The pass trails close under winter snow.",
  howToGetThere: [
    "Fly from Nepalgunj or Kathmandu to Jufal Airport in Dolpa (weather dependent).",
    "Drive from Nepalgunj over the Khali Lagna pass before trekking 2–3 days to the lake.",
    "Trekking to Shey Phoksundo requires a restricted-area permit for the Upper Dolpo region.",
  ],
  accommodation:
    "Basic teahouses and camping lodges operate at Suligad and Ringmo during the season, with simple bed spaces and warm dals served by local families.",
  foodExperiences:
    "Meals stay simple and local — dal bhat, chapati, roasted barley (tsampa), yak cheese and butter tea warmed over wood stoves.",
  travelTips: [
    "Arrange a restricted-area permit and licensed guide well in advance",
    "Build altitude slowly and stay hydrated — the lake sits above 3,600 m",
    "Carry a water filter; lodging water is not always safe to drink",
    "Pack thermal layers; the nights are cold even in summer",
    "Allow a minimum of 7–10 days for the round trip from Kathmandu",
  ],
  quickFacts: [
    "Elevation: 3,611 m (11,850 ft)",
    "One of the world's deepest lakes",
    "In Nepal's largest national park",
    "Home to living Bon monasteries",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Shey Phoksundo",
};

export default post;