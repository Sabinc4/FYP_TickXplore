import type { BlogPost } from "../types";
import Chitwan from "/Pictures/Chitwan.jpg";

const post: BlogPost = {
  slug: "chitwan",
  title: "Chitwan National Park",
  tagline: "UNESCO World Heritage site with wildlife safari",
  heroImage: Chitwan,
  intro:
    "Chitwan National Park is Nepal's first and most famous national park, a lush lowland jungle where one-horned rhinos, Bengal tigers and elephants roam free. A safari here is a journey into the heart of the Terai.",
  overview:
    "Established in 1973 and declared a UNESCO World Heritage Site in 1984, Chitwan National Park covers roughly 952 square kilometres of subtropical forest, grasslands and riverine habitat. Visitors come for jeep safaris, canoe rides along the Rapti river and guided jungle walks led by experienced naturalists. It is the best place in Nepal for wildlife spotting and an unmissable stop for nature lovers.",
  history:
    "Chitwan was once a royal hunting ground of the Rana rulers, who used the dense jungles to hunt tigers and rhinos. Concern over dwindling wildlife numbers led to conservation efforts, and in 1973 the park was formally established to protect the one-horned rhinoceros and its habitat.",
  attractions: [
    {
      title: "Jeep Safari",
      description:
        "Hop aboard a 4WD safari jeep to explore the deep jungle in search of one-horned rhinos, deer, wild boar, and occasionally the elusive Royal Bengal tiger.",
    },
    {
      title: "Canoe Ride on the Rapti River",
      description:
        "Glide silently down the Rapti in a traditional dugout canoe, spotting gharial crocodiles, marsh muggers and a rich variety of river birds.",
    },
    {
      title: "Elephant Breeding Centre",
      description:
        "Visit the government-run elephant breeding centre in Khorsor to learn about elephant conservation and meet the gentle giants up close.",
    },
    {
      title: "Tharu Cultural Village",
      description:
        "Experience the traditional dance, music and food of the indigenous Tharu people who have lived alongside the jungle for generations.",
    },
    {
      title: "Jungle Walk & Bird Watching",
      description:
        "Accompanied by a trained guide, set out on foot to track wildlife and enjoy one of the best bird-watching destinations in Asia — over 540 species.",
    },
    {
      title: "Sunset Point & Gharial Breeding Centre",
      description:
        "Climb the watchtower for sweeping views over the floodplain at sunset, and learn about the critically endangered gharial crocodile.",
    },
  ],
  thingsToDo: [
    "Take a morning or evening jeep safari through the core jungle areas",
    "Enjoy a peaceful canoe ride along the Rapti or Narayani rivers",
    "Explore Sauraha's bustling market and riverside cafes",
    "Watch a Tharu cultural dance performance in the evening",
    "Go on a guided jungle walk at sunrise",
    "Visit the elephant and gharial breeding centres",
  ],
  bestTimeToVisit:
    "October to March offers clear skies, pleasant weather and the best wildlife sightings. April to June is hot but ideal for tiger spotting near waterholes, while July to September brings monsoon rains.",
  howToGetThere: [
    "Fly from Kathmandu to Bharatpur Airport (about 25 minutes), then take a short 20-minute drive to Sauraha.",
    "Take a tourist bus from Kathmandu to Sauraha or Bharatpur — roughly a 5 to 6 hour scenic journey.",
    "Drive yourself from Pokhara in about 4 to 5 hours via Mugling and Bharatpur.",
  ],
  accommodation:
    "Sauraha and the nearby gated jungle resorts offer everything from budget guesthouses to luxury eco-lodges and five-star safari resorts, many set beside the Rapti river.",
  foodExperiences:
    "Sample Newari thali, Tharu-set meals, and fresh river fish at local eateries, or enjoy international cuisine at resort restaurants. Don't miss the lively Sauraha cafe scene after sunset.",
  travelTips: [
    "Always book safari activities through a registered guide or lodge",
    "Carry insect repellent and wear neutral-coloured, long clothing for the jungle",
    "Keep noise low during walks and safaris for the best wildlife encounters",
    "Carry small bills — many local shops accept cash only",
    "Plan a minimum of two nights to make the most of the park",
  ],
  quickFacts: [
    "Established: 1973 (UNESCO World Heritage Site since 1984)",
    "Area: ~952 km² of jungle, grassland and wetlands",
    "Famous for: One-horned rhinoceros and Royal Bengal tiger",
    "Bird species recorded: 540+",
  ],
  pickupPoint: "Kathmandu",
  dropPoint: "Chitwan",
};

export default post;