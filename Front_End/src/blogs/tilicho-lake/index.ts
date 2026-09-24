import type { BlogPost } from "../types";

// Hero image: matches the image used for Tilicho Lake in the tourist-area data.
// Swap for a local asset (e.g. /Pictures/Tilicho.jpg) when available.
const heroImage =
  "https://res.cloudinary.com/images-swotahtravel-com/image/upload/v1724645061/blog%20images/tilicho_lake_view_swotah.png";

const post: BlogPost = {
  slug: "tilicho-lake",
  title: "Tilicho Lake",
  tagline: "One of the world's highest lakes, beneath the great Annapurna wall",
  heroImage,
  intro:
    "Tilicho Lake is a frozen jewel wedged between towering granite walls at 4,919 metres — one of the highest lakes on Earth, reached by a demanding high-altitude side trek from the Annapurna Circuit.",
  overview:
    "Cradled in the Manang district, Tilicho Lake stretches beneath the great Annapurna and Nilgiri ramparts. The approach crosses the windswept Khangsar valley and climbs past Tilicho Base Camp to the lake and beyond to the Mesokanta La pass. It is a short but strenuous detour that rewards trekkers with one of the Himalaya's most dramatic and isolated landscapes.",
  history:
    "Sacred to both Hindus and Buddhists, Tilicho (also known as Tilicho Tal) appears in the Ramayana — the sage Valmiki is said to have meditated on its shores. The route was central to the classic Annapurna Circuit, and the lake's south face forms part of the celebrated and extreme 'Tilicho Face' of Annapurna I, one of the largest alpine walls ever climbed.",
  attractions: [
    {
      title: "The Lake Itself",
      description:
        "Stand by the deep blue, often partially frozen waters at 4,919 m and watch small icebergs drift — a surreal, silent scene under the Annapurna massif.",
    },
    {
      title: "Khangsar Village & Valley",
      description:
        "Pass the lonely settlement of Khangsar and its ruined houses, with panoramic views of Gangapurna, Khangsar Kang and the giant north wall of Annapurna.",
    },
    {
      title: "Tilicho Base Camp & High Camp",
      description:
        "Climb through moraines and glacial rubble to the high camps that frame the approach — an adventure in itself above the cloud line.",
    },
    {
      title: "Mesokanta La Viewpoint",
      description:
        "Continue over the 5,371 m pass for sweeping views across Tibetan-style high country, Jomsom and the Kali Gandaki valley far below.",
    },
    {
      title: "Annapurna & Gangapurna Views",
      description:
        "The lake's north shore opens onto one of the Himalaya's most dramatic ridge-lines — Nilgiri, Gangapurna and the massive Tilicho Face.",
    },
  ],
  thingsToDo: [
    "Trek the classic Manang–Tilicho side route from Koto or Humde",
    "Spend the afternoon walking the lake's stony shoreline",
    "Photograph Annapurna, Gangapurna and Nilgiri at first light",
    "Cross Mesokanta La for the full Annapurna Circuit loop",
    "Watch the lake's floating ice from the moraine ridge above",
  ],
  bestTimeToVisit:
    "Late June to September and October to November are the safest windows, when the trail is clear of deep snow. In winter and early spring avalanche risk is high and the lake freezes over.",
  howToGetThere: [
    "Fly from Pokhara to Jomsom or take the road from Pokhara/Besisahar, then drive to Manang via the Annapurna Circuit road.",
    "Begin the side trek at Manang, following the valley past Khangsar to Tilicho Base Camp (4,100 m).",
    "Climb to Tilicho High Camp (4,920 m) for an early start to the lake and, for fit trekkers, the Mesokanta La crossing to Jomsom.",
    "Permits required: ACAP entry permit and TIMS card (arranged via a licensed agency or local tourism office).",
  ],
  accommodation:
    "Teahouses and basic lodges operate at Khangsar, Tilicho Base Camp and Tilicho High Camp during the season, offering dorm beds, dal bhat and hot drinks.",
  foodExperiences:
    "Expect simple high-mountain food — dal bhat, noodles, porridge and Tibetan bread — cooked over wood stoves in the high lodges, with hot tea to beat the cold.",
  travelTips: [
    "Ascend slowly from Manang (3,540 m) — Tilicho sits above 4,900 m and altitude sickness is a real risk",
    "Carry a water filter; the high camps rely on glacial streams",
    "Pack a sleeping bag liner and thermal layers; nights are freezing",
    "Book lodges ahead in mid-season — High Camp has very few beds",
    "Carry your ACAP and TIMS permits at all times; they are checked along the route",
    "Be flexible — weather and snow can force a return via the same route",
  ],
  quickFacts: [
    "Elevation: 4,919 m (16,139 ft) — one of the world's highest lakes",
    "Region: Manang district, Annapurna Conservation Area",
    "Access: side trek off the Annapurna Circuit from Manang",
    "Permits required: ACAP entry permit + TIMS card",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Tilicho Lake",
};

export default post;