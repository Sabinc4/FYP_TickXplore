import type { BlogPost } from "../types";
import Poon from "/Pictures/Poon.jpg";

const post: BlogPost = {
  slug: "poon-hill",
  title: "Poon Hill",
  tagline: "Breathtaking sunrise over the Annapurna range",
  heroImage: Poon,
  intro:
    "Poon Hill is Nepal's most beloved short trek destination, offering a jaw-dropping 360-degree sunrise panorama of the Annapurna and Dhaulagiri ranges from just 3,210 metres above sea level.",
  overview:
    "Sitting on the rim of the Ghorepani valley in the Annapurna region, Poon Hill rewards trekkers with one of the finest mountain views in the world. The classic three-to-four-day Ghorepani–Poon Hill loop passes through rhododendron forests, Gurung villages and terraced farmlands, making it perfect for first-time trekkers and families.",
  history:
    "Poon Hill lies on the famous Annapurna Circuit trail that has drawn trekkers to the central Himalayas for decades. While the route was long a thoroughfare for traders between India and Tibet, it grew into a global trekking icon thanks to its unique panorama uniting two of the world's ten highest peaks.",
  attractions: [
    {
      title: "Sunrise from the Watchtower",
      description:
        "Climb the 3,210 m viewpoint before dawn to watch the sun ignite the peaks of Annapurna I, Dhaulagiri, Machapuchare and Nilgiri in golden light.",
    },
    {
      title: "Ghorepani Village",
      description:
        "Stay overnight in this hilltop village of stone cottages and mountain guesthouses set among forested ridges.",
    },
    {
      title: "Rhododendron Forests",
      description:
        "In spring, the trail glows pink and red with blooming rhododendrons — Nepal's national flower — in the Annapurna conservation area.",
    },
    {
      title: "Gurung Villages & Culture",
      description:
        "Pass through traditional Gurung settlements like Ghandruk and Ulleri, famous for their hospitality, terracotta roofs and deep cultural roots.",
    },
  ],
  thingsToDo: [
    "Wake early for the unforgettable Poon Hill sunrise trek",
    "Hike the Ghorepani–Ghandruk loop through rhododendron forests",
    "Relax in a mountain teahouse with hot dal bhat and mountain views",
    "Photograph Dhaulagiri, Annapurna and Machapuchare from the viewpoint",
    "Explore the terraced Gurung village of Ghandruk and its museum",
  ],
  bestTimeToVisit:
    "October to November and March to April offer clear skies, warm days and rhododendron blooms in spring. December to February can be cold and snowy but stunningly clear.",
  howToGetThere: [
    "Drive from Pokhara to Nayapul (about 1.5 to 2 hours), then trek through Hile and Ulleri to Ghorepani.",
    "Take a tourist bus from Kathmandu to Pokhara, then transfer to a jeep or local bus bound for Nayapul.",
    "Guided group treks depart regularly from Pokhara throughout the season.",
  ],
  accommodation:
    "Trekking teahouses line the entire route, from basic stone lodges in Ghorepani to comfortable guesthouses in Ghandruk, most offering warm meals and dorm or private rooms.",
  foodExperiences:
    "Fuel up on dal bhat, thukpa (noodle soup), and buckwheat roti served at trekking lodges, and keep energy high with Tibetan bread and local millet tea (tongba).",
  travelTips: [
    "Start the sunrise climb at around 4:30 to 5:00 am to reach the top before dawn",
    "Dress warmly — the viewpoint is cold and windy even in summer",
    "Carry a good torch/headlamp for the early-morning ridge walk",
    "Pack layers; the temperature drops sharply at 3,200 m",
    "Hire a local guide or carry a map — the trail junctions can be confusing",
  ],
  quickFacts: [
    "Elevation: 3,210 m (10,531 ft)",
    "Trek duration: 3–4 days for the classic loop",
    "Highest peaks visible: Dhaulagiri (8,167 m), Annapurna I (8,091 m), Machapuchare (6,993 m)",
    "Best season: October–November and March–April",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Poon Hill",
};

export default post;