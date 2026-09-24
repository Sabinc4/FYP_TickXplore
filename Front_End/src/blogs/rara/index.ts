import type { BlogPost } from "../types";
import Rara from "/Pictures/Rara.jpg";

const post: BlogPost = {
  slug: "rara",
  title: "Rara Lake",
  tagline: "Nepal's largest lake, hidden in the Karnali hills",
  heroImage: Rara,
  intro:
    "Rara Lake is Nepal's largest and deepest lake, a jewel of crystal-blue water cradled by pine and juniper forests in the remote highlands of the Karnali region — one of the country's most pristine and least crowded natural escapes.",
  overview:
    "Sitting at 2,990 metres inside Rara National Park, the lake stretches 5 kilometres long and is surrounded by snow-capped summits. With fewer than a handful of villages nearby, Rara offers quiet trekking, rare wildlife like red pandas and Himalayan black bears, and some of the most untouched scenery in Nepal.",
  history:
    "Rara Lake has long been revered by locals, who hold an annual festival honouring their lake goddess. The national park was established in 1976 to protect the lake's watershed and its unique flora and fauna, and the region remained largely off the tourist map until roads and flights made it newly accessible.",
  attractions: [
    {
      title: "The Lake Itself",
      description:
        "Spend a full day walking its shoreline — from every angle the water shifts between azure and emerald hues beneath the high peaks.",
    },
    {
      title: "Murma Top Viewpoint",
      description:
        "Climb the hilltop above the lake for a sweeping view over the blue water and the forested ridges beyond.",
    },
    {
      title: "Island Shrine & Ram Gaon",
      description:
        "Visit the small temple island on the lake and the hamlet of Ram Gaon with its red-roofed cottages and serene farms.",
    },
    {
      title: "Wildlife & Bird Watching",
      description:
        "Spot musk deer, Himalayan black bears, monals and golden eagles while hiking the park trails.",
    },
  ],
  thingsToDo: [
    "Circumnavigate Rara Lake on foot (a relaxing 2-day walk)",
    "Hike to Murma Top for the classic overview shot",
    "Row a boat on the lake at sunrise",
    "Spend quiet nights stargazing away from all light pollution",
    "Explore the tiny lakeside villages of Ram Gaon and Rara Village",
  ],
  bestTimeToVisit:
    "May–June and September–October bring the best weather. July–August is the monsoon and trails get muddy; winter snow can block access from December to February.",
  howToGetThere: [
    "Fly from Nepalgunj to Talcha Airport (nearest air link), about a 30-minute flight, then a 1-hour walk to the lake.",
    "Take a bus from Kathmandu to Nepalgunj (12–14 hours), then fly or drive onward.",
    "Jeep transfers connect Surkhet to the Rara roadhead during the trekking seasons.",
  ],
  accommodation:
    "Simple lodges and guesthouses serve Rara Village and Ram Gaon, with home-style dal bhat and heating by wood stove in the cold nights.",
  foodExperiences:
    "Expect hearty Nepali meals and local produce; try honey, milk and apples from the Keladighat farms, plus local ghee and cheese.",
  travelTips: [
    "Book flights to Talcha early as seats are limited",
    "Temperatures drop sharply at night — bring warm layers",
    "Give yourself at least two nights to enjoy the lake calmly",
    "Carry snacks — village shops stock little beyond basics",
    "Respect the national park rules; keep the shore clean",
  ],
  quickFacts: [
    "Elevation: 2,990 m (9,810 ft)",
    "Size: Nepal's largest lake (~10.8 km²)",
    "Protected by: Rara National Park (est. 1976)",
    "Wildlife: red panda, musk deer, Himalayan black bear",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Rara",
};

export default post;