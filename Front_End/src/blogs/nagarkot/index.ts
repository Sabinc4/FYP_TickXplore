import type { BlogPost } from "../types";
import Nagarkot from "/Pictures/Nagarkot.jpg";

const post: BlogPost = {
  slug: "nagarkot",
  title: "Nagarkot",
  tagline: "Panoramic Himalaya views just outside Kathmandu",
  heroImage: Nagarkot,
  intro:
    "Nagarkot sits on a forested ridge just 32 kilometres east of Kathmandu, famous for its sweeping Himalayan panorama and one of Nepal's most spectacular sunrises — all within easy reach of the capital.",
  overview:
    "Perched at 2,175 metres, Nagarkot is the closest hill station to Kathmandu, offering birds-eye views of the Annapurna range, Ganesh Himal and on clear days, Mount Everest. Beyond the sunrise viewpoints, visitors enjoy forest walks, mountain-biking trails, and peaceful resorts nestled among pine and rhododendron woods.",
  history:
    "Nagarkot was once the summer retreat of the royal family both of the Kathmandu valley kingdoms and, later, of the Shah dynasty. Its ancient hilltop fort, now in ruins, played a role in valley defence and adds a layer of history to the serene ridges.",
  attractions: [
    {
      title: "Sunrise & Sunset Viewpoints",
      description:
        "Watch the Himalaya glow pink at dawn and crimson at dusk from the lookout tower and hotel terraces along the ridge.",
    },
    {
      title: "Himalayan Panorama",
      description:
        "On clear days the range extends from Annapurna and Manaslu in the west all the way to Everest and Kanchenjunga in the east.",
    },
    {
      title: "Nagarkot View Tower",
      description:
        "A short walk from the main road, this tower offers an elevated 360-degree outlook over the valley and mountains.",
    },
    {
      title: "Forest Walks & Biking",
      description:
        "Explore pine and rhododendron forest trails leading to Tamang villages, or rent a bike for the scenic ridge ride back toward Bhaktapur.",
    },
  ],
  thingsToDo: [
    "Reach a viewpoint before dawn for the famous Himalayan sunrise",
    "Hike the short forest trail to the Nagarkot View Tower",
    "Ride or bike the scenic jeep road down through Changunarayan village",
    "Enjoy a warm breakfast with mountain views at a ridge-top resort",
    "Visit the historic Chamere and Nagarkot forts",
  ],
  bestTimeToVisit:
    "October to February offers the clearest Himalayan views, while March to May brings rhododendron blooms. The monsoon (June–September) can shroud the peaks.",
  howToGetThere: [
    "Hire a taxi or private car from Kathmandu or Bhaktapur — about a 1 to 1.5 hour drive.",
    "Take a local tourist bus from Kathmandu to Nagarkot (roughly 2 hours).",
    "Combine a cultural visit to Bhaktapur Durbar Square with the mountain views in one circle route.",
  ],
  accommodation:
    "From boutique hilltop resorts and heritage-style hotels to simple community lodges, Nagarkot has a stay for every budget, most designed around the sunrise view.",
  foodExperiences:
    "Most resorts offer buffets of Chinese, continental and Nepali dishes. In the villages, try dal bhat and local roasted chiura (beaten rice) with tea.",
  travelTips: [
    "Check the forecast — clear mornings are key to the view",
    "Book a sunrise-facing room or reach the viewpoint early",
    "Dress warmly; the ridge gets chilly, especially in winter",
    "Combine with Bhaktapur and Changunarayan for a fuller day trip",
    "Carry cash — many small lodges don't accept cards",
  ],
  quickFacts: [
    "Elevation: 2,175 m (7,136 ft)",
    "Distance from Kathmandu: ~32 km (1–1.5 hrs)",
    "Views include: Everest, Annapurna, Ganesh Himal, Langtang",
    "Popular as: Kathmandu's closest hill station",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Nagarkot",
};

export default post;