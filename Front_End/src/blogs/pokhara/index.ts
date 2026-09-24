import type { BlogPost } from "../types";
import Pokhara from "/Pictures/Pokhara.jpeg";

const post: BlogPost = {
  slug: "pokhara",
  title: "Pokhara",
  tagline: "Lakeside gateway to adventure and serenity",
  heroImage: Pokhara,
  intro:
    "Pokhara cradles itself around a glassy lakeside at the foot of the Annapurnas, Nepal's adventure capital where paragliders drift over Phewa Lake and the snow peaks tower just behind the city skyline.",
  overview:
    "Set at 822 metres, Pokhara is the country's second city and its ultimate outdoor playground. Its lakeside district brims with cafes and adventure outfitters, while outings for paragliding, boating, zip-lining, and short treks to the World Peace Pagoda and Sarangkot make it a relaxing hub between adventures.",
  history:
    "Pokhara grew from a trading settlement on the salt route to Tibet into a major tourist gateway after tourism reached Nepal in the 1960s. Landmark villages like Begnas and Rupa retain a slower rural pace, while the lakeside has evolved into the traveller-friendly district known today.",
  attractions: [
    {
      title: "Phewa Lake & Tal Barahi Temple",
      description:
        "Paddle a colourful boat across Phewa to the island temple of Tal Barahi, set against the reflection of the Annapurnas.",
    },
    {
      title: "Sarangkot Sunrise",
      description:
        "Watch sunrise from Sarangkot (1,600 m) for a 360-degree panorama of Annapurna, Dhaulagiri and Machapuchare.",
    },
    {
      title: "World Peace Pagoda",
      description:
        "Hike or drive up to this gleaming white stupa on a hilltop opposite the lake for unbeatable views over Pokhara.",
    },
    {
      title: "David's Fall & Gupteshwor Cave",
      description:
        "Visit the dramatic waterfall that plunges into a gorge and the sacred cave hiding a naturally formed Shiva lingam beside it.",
    },
    {
      title: "Adventure Sports",
      description:
        "Paraglide, zip-line, ultra-light-flip or paddleboard — Pokhara offers some of the world's best-value air sports.",
    },
    {
      title: "Begnas & Rupa Lakes",
      description:
        "Escape the crowds at the serene eastern lakes, ringed by rice terraces and forested hills.",
    },
  ],
  thingsToDo: [
    "Rent a boat on Phewa Lake at sunset",
    "Takе an early jeep or hike to Sarangkot for sunrise",
    "Go paragliding tandems with views of the Annapurnas",
    "Cycle or stroll the lakeside promenade and café-lined streets",
    "Plan a day trip to the World Peace Pagoda and Devi's Fall",
  ],
  bestTimeToVisit:
    "October to December and February to April offer clear mountain views and pleasant temperatures. The monsoon (June–September) brings clouds that hide the peaks.",
  howToGetThere: [
    "Fly from Kathmandu to Pokhara in about 25 minutes.",
    "Take a tourist bus from Kathmandu — a scenic 6 to 7 hour journey.",
    "Drive your own vehicle via the new Prithvi and Kali Gandaki highways.",
  ],
  accommodation:
    "Lakeside is packed with options, from backpacker hostels and boutique hotels to luxury resorts with Annapurna views, plus peaceful guesthouses around Begnas Lake.",
  foodExperiences:
    "Enjoy fresh lake fish, Newari dishes like bara and samay baji, and a booming cafe scene serving everything from pizzas to authentic Nepali thalis.",
  travelTips: [
    "Check the weather before booking air sports — mornings are clearest",
    "Pre-book shuttle tickets to Sarangkot for sunrise",
    "Carry some cash for stalls and smaller restaurants",
    "Use Pokhara as a base to explore Poon Hill, Ghandruk and Jomsom",
    "Be cautious on the boat piers and pack a rain jacket in summer",
  ],
  quickFacts: [
    "Elevation: 822 m (2,697 ft)",
    "Lake: Phewa Lake, Nepal's second largest",
    "Gateway to: Annapurna and Mustang regions",
    "Top activity: Paragliding over Phewa Lake",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Pokhara",
};

export default post;