import type { BlogPost } from "../types";
import Kalinchok from "/Pictures/Kalinchok.jpeg";

const post: BlogPost = {
  slug: "kalinchok",
  title: "Kalinchok",
  tagline: "Kuri village & the famous Kalinchowk shrine",
  heroImage: Kalinchok,
  intro:
    "Kalinchok is a 3,186-metre hill shrine on the Dolkha ridge that has become one of Kathmandu's favourite quick snow getaways — a place of a holy Kali temple, ropeway-accessible meadows, and winter snows that draw day-trippers in droves.",
  overview:
    "Perched on the Kalinchowk Bhagwati ridge above the Kuri village, the destination pairs a sacred temple dedicated to Goddess Kali with wide views of the Himalaya and Garhi, Chuli and other high peaks. In winter, snowfall transforms the meadow into a sparkling playground, while summer hikes reveal wildflower pastures.",
  history:
    "The Kalinchowk Bhagwati temple has for centuries been a place of pilgrimage among the Dolkha and Kathmandu communities, and the ridge itself marks an old trade and religious path. The modern ropeway from Kuri village added easy access, turning this quiet shrine into a popular weekend escape.",
  attractions: [
    {
      title: "Kalinchowk Bhagwati Temple",
      description:
        "Climb the final stairway to the ancient temple of Goddess Kali and offer prayers with panoramic mountain views at your back.",
    },
    {
      title: "The Ropeway Ride",
      description:
        "Enjoy a smooth cable-car ride from Kuri village up the steep meadow slopes to the temple plateau.",
    },
    {
      title: "Himalayan Viewpoint",
      description:
        "On clear days the ridge reveals the Gauri Shankar range, Langtang peaks and the Rolwaling Himal.",
    },
    {
      title: "Kuri Village & Snow Play",
      description:
        "Base yourself in Kuri's lodges and, in season, sled and play in the winter snow around the temple area.",
    },
  ],
  thingsToDo: [
    "Ride the ropeway and hike the temple steps",
    "Watch sunrise over the Himalaya from the ridge",
    "Sled and throw snowballs when the meadow holds winter snow",
    "Photograph the layers of green hills rolling toward Tibet",
    "Enjoy hot tea and local snacks at the village lodges",
  ],
  bestTimeToVisit:
    "October–November offers clear views; January–February brings reliable snow for the fun of winter. Monsoon months are muddy and clouded.",
  howToGetThere: [
    "Take a tourist bus or private jeep from Kathmandu to Charikot and then on to Kuri village (about 5 hours).",
    "Walk up from Kuri through the forest trail in about 1.5–2 hours, or take the ropeway.",
    "Return via the scenic route toward Jiri, the trailhead of traditional Everest treks.",
  ],
  accommodation:
    "Simple lodges and community guesthouses in Kuri village offer warm rooms, hot meals and fireside evenings.",
  foodExperiences:
    "Expect filling Nepali meals — dal bhat, noodles and momos — plus hot tea and local drinks sold at the village and temple stalls.",
  travelTips: [
    "Go on weekdays in season to avoid the heavy weekend crowds",
    "Dress in layers; the ridge is windy and cold even in summer",
    "Carry cash — the ropeway and village shops are cash only",
    "Check the weather before heading up — clouds can hide everything",
    "Wear sturdy shoes; the temple steps can become icy in winter",
  ],
  quickFacts: [
    "Elevation: 3,186 m (10,454 ft)",
    "Sacred temple: Kalinchowk Bhagwati",
    "Access: ropeway from Kuri village",
    "Close to: Charikot & Dolakha",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Kalinchok",
};

export default post;