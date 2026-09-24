import type { BlogPost } from "../types";
import NamoBuddha from "/Pictures/Namo_Buddha.jpg";

const post: BlogPost = {
  slug: "namo-buddha",
  title: "Namo Buddha",
  tagline: "Serene Buddhist stupa and hilltop retreat",
  heroImage: NamoBuddha,
  intro:
    "Namo Buddha is a peaceful hilltop stupa in the hills east of Kathmandu, sacred to Buddhists as the site where a young prince offered his body to a starving tigress — a story of compassion that draws pilgrims and tranquillity-seekers alike.",
  overview:
    "Set high above the villages of Panauti and Banepa, Namo Buddha (known locally as Takmo Lüjin) rises about 40 kilometres from Kathmandu. The gleaming white stupa, quiet monastery and sweeping views over the valley make it a serene day trip, short pilgrimage trek, or meditation retreat, rooted in one of the most beloved tales of Buddhist selflessness.",
  history:
    "According to the Jataka tales, the site marks where Prince Mahasattva, a previous life of the Buddha, gave his body to a starving tigress and her cubs. The great Thralu and Thrashu gompas were later established here, and the complex hosts monks training in Tibetan Buddhist traditions.",
  attractions: [
    {
      title: "Thrangu Tashi Yangtse Monastery",
      description:
        "Visit the hilltop monastery, its golden spires and ornate prayer halls, home to a community of monks and nuns.",
    },
    {
      title: "The Sacred Stupa",
      description:
        "Walk the kora (circumambulation path) around the stupa and the bronze statue of the young prince offering himself to the tigress.",
    },
    {
      title: "Panoramic Valley Views",
      description:
        "Gaze across the ridges and terraced fields toward the Himalaya from the monastery terraces.",
    },
    {
      title: "Pilgrimage Trek from Panauti",
      description:
        "Hike the short, beautiful trail from the medieval Newari town of Panauti through pine hills to the stupa.",
    },
  ],
  thingsToDo: [
    "Walk the kora around the stupa at sunrise or sunset",
    "Observe monks' prayers in the monastery courtyard",
    "Trek from Panauti for a half-day pilgrimage",
    "Enjoy a quiet retreat among the meditation centres",
    "Photograph the Himalayan views beyond the valley",
  ],
  bestTimeToVisit:
    "October to March offers the clearest views. Evening is especially magical, when the stupa glows against the dusk and the monks gather for prayers.",
  howToGetThere: [
    "Drive east from Kathmandu through Bhaktapur and Banepa to Dhulikhel, then take the road uphill to Namo Buddha (about 1.5 hours).",
    "Take a local bus to Panauti and trek the scenic 2–3 hour trail up to the stupa.",
    "Hire a private taxi or join a guided day tour from Kathmandu or Dhulikhel.",
  ],
  accommodation:
    "A few simple guesthouses and monastery-run retreats offer overnight stays, while nearby Dhulikhel and Panauti provide boutique and heritage hotels.",
  foodExperiences:
    "Enjoy monastery vegetarian meals and local dishes in the surrounding villages; Panauti is famous for Newari cuisine and juju dhau, the king of yoghurt.",
  travelTips: [
    "Remove shoes and silence phones inside the monastery halls",
    "Ask permission before photographing monks or sacred murals",
    "Visit at prayer times (early morning or late afternoon) for atmosphere",
    "Combine with Panauti and Dhulikhel for a fuller day from Kathmandu",
    "Carry water — the walk from Panauti has no shops on the trail",
  ],
  quickFacts: [
    "Location: Kavre hills, 40 km east of Kathmandu",
    "Sacred story: Prince Mahasattva and the starving tigress",
    "Main monastery: Thrangu Tashi Yangtse",
    "Best season: October–March",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Namo Buddha",
};

export default post;