import type { BlogPost } from "../types";
import Mustang from "/Pictures/Mustang.jpg";

const post: BlogPost = {
  slug: "mustang",
  title: "Upper Mustang",
  tagline: "Tibetan culture, monasteries and desert-like valleys",
  heroImage: Mustang,
  intro:
    "Tucked behind the Annapurna and Dhaulagiri ranges, Upper Mustang is a high-altitude desert kingdom of windswept cliffs, cave dwellings and ancient Buddhist monasteries — the last preserved stronghold of Tibetan culture in Nepal.",
  overview:
    "Upper Mustang opens north of the village of Kagbeni along the valley of the Kali Gandaki river. Its capital, Lo Manthang, is a walled medieval city founded in the 15th century. Home to centuries-old gompas, sky caves and eroded canyons, the region offers trekking through landscapes that feel more like the Tibetan plateau than the green hills of the rest of Nepal.",
  history:
    "The Kingdom of Lo was an independent Tibetan-speaking state for centuries, connected by salt trade routes to Tibet. The region only opened to foreign travellers in 1992, and visitors still require a special restricted-area permit. The famous caves of Mustang, some over 2,000 years old, hold ancient manuscripts, paintings and mummies.",
  attractions: [
    {
      title: "Lo Manthang — the Walled City",
      description:
        "Explore the medieval capital's earthen walls, royal palace and its four ancient gompas, including the Thugchen Gompa.",
    },
    {
      title: "Sky Caves of Mustang",
      description:
        "Marvel at man-made caves carved into sheer cliffs, used for centuries as dwellings, burial chambers and meditation retreats.",
    },
    {
      title: "Muktinath Temple",
      description:
        "Visit this sacred temple where pilgrims of both Hindu and Buddhist faiths pay homage among 108 water spouts at 3,800 metres.",
    },
    {
      title: "Monasteries & Chortens",
      description:
        "Walk the trail of prayer flags, mani walls and gompas that make Upper Mustang a living centre of Vajrayana Buddhism.",
    },
    {
      title: "Dramatic Canyon Landscapes",
      description:
        "Trek through wind-carved canyons, bare cliffs and red desert hills that recall the Yarlung Tsangpo gorge of Tibet.",
    },
    {
      title: "Lo Gekar Monastery",
      description:
        "One of the oldest monasteries in the Mustang region, its murals are considered among the finest in the Himalaya.",
    },
  ],
  thingsToDo: [
    "Trek from Kagbeni through Ghami to the walled city of Lo Manthang",
    "Visit the ancient sky caves and rock-hewn monasteries",
    "Photograph the desert-like valleys at golden hour",
    "Join the morning circumambulation of Lo Manthang's chortens",
    "Climb the ridge above Lo Manthang for views over the plateau",
  ],
  bestTimeToVisit:
    "May to September sees clear skies and manageable temperatures. October offers warmer days but is an equinox-wind season; winter is harsh and can cut off the region.",
  howToGetThere: [
    "Fly from Pokhara to Jomsom (about 20 minutes), then trek through Kagbeni into Upper Mustang.",
    "Drive from Pokhara to Jomsom via Beni and Tatopani (a long but scenic 8–10 hour journey).",
    "Trekking in Upper Mustang requires a special restricted-area permit obtained through a licensed trekking agency.",
  ],
  accommodation:
    "Simple teahouses and homestay guesthouses in villages like Kagbeni, Ghami and Lo Manthang offer dal bhat, Tibetan bread and yaks cheese.",
  foodExperiences:
    "Expect hearty Tibetan cuisine — thukpa, momos, yak meat stew, and butter tea — cooked in village kitchens from locally grown barley and wind-dried produce.",
  travelTips: [
    "Obtain the restricted-area permit and TIMS card well in advance via a registered agency",
    "Carry US dollars in smaller denominations for permit payments",
    "Pack for high altitude — much of the trek sits above 3,500 m",
    "Drink plenty of water and ascend slowly to avoid altitude sickness",
    "Respect monastery rules: remove shoes, avoid photos of sacred art unless allowed",
  ],
  quickFacts: [
    "Region: High-altitude Tibetan-style plateau",
    "Capital: Lo Manthang (walled medieval city)",
    "Restricted-area permits required",
    "Best months: May–September",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Mustang",
};

export default post;