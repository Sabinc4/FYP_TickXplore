/**
 * SAMPLE accommodation data for the Stay discovery page.
 * ------------------------------------------------------------------
 * IMPORTANT: This is demo/sample data (realistic mockups) used to power
 * the UI. It is NOT live inventory — "availability", distances, ratings
 * and prices are illustrative. When a real accommodation API/backend is
 * ready, replace this module (and the filtering helpers) with API calls.
 */

export type AccommodationType =
  | "Hotel"
  | "Villa"
  | "Private Room"
  | "Apartment"
  | "Guest House";

export type AccommodationBadge = "Popular" | "Featured" | "Great Value" | "New";

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  city: string;
  neighborhood: string;
  address: string;
  image: string;
  gallery: string[];
  badge?: AccommodationBadge;
  description: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number; // NPR
  amenities: string[];
  availableNow: boolean;
  distanceKm: number;
  popularityScore: number;
  isSample: true;
}

export interface PopularLocation {
  id: string;
  name: string;
  subtitle: string;
  staysCount: number;
  image: string;
}

export const AMENITIES = [
  "Free Wi-Fi",
  "Swimming Pool",
  "Air Conditioning",
  "Parking",
  "Breakfast Included",
  "Pet Friendly",
  "Mountain View",
  "Kitchen",
] as const;

export type Amenity = (typeof AMENITIES)[number];

const img = (ref: string, w = 900) =>
  `https://images.unsplash.com/${ref}?auto=format&fit=crop&w=${w}&q=80`;

/** Reused Unsplash references so galleries look cohesive per property. */
const U = {
  hotelRoomA: (w: number) => img("photo-1566073771259-6a8506099945", w),
  hotelRoomB: (w: number) => img("photo-1582719508461-905c673771fd", w),
  hotelRoomC: (w: number) => img("photo-1571896349842-33c89424de2d", w),
  hotelRoomD: (w: number) => img("photo-1590490360182-c33d57733427", w),
  hotelRoomE: (w: number) => img("photo-1611892440504-42a792e24d32", w),
  hotelExterior: (w: number) => img("photo-1564501049412-61c2a3083791", w),
  hotelExteriorNight: (w: number) => img("photo-1542314831-068cd1dbfeeb", w),
  resortPool: (w: number) => img("photo-1584132967334-10e028bd69f7", w),
  resortPoolTwo: (w: number) => img("photo-1520250497591-112f2f40a3f4", w),
  resortPoolThree: (w: number) => img("photo-1445019980597-93fa8acb246c", w),
  villaPool: (w: number) => img("photo-1512917774080-9991f1c4c750", w),
  villaPoolSea: (w: number) => img("photo-1571003123894-1f0594d2b5d9", w),
  villaBeach: (w: number) => img("photo-1505577058444-a3dab90d4253", w),
  houseModern: (w: number) => img("photo-1600585154340-be6161a56a0c", w),
  houseGarden: (w: number) => img("photo-1449844908441-8829872d2607", w),
  houseClassic: (w: number) => img("photo-1564013799919-ab600027ffc6", w),
  houseCottage: (w: number) => img("photo-1518780664697-55e3ad937233", w),
  apartmentInterior: (w: number) => img("photo-1493809842364-78817add7ffb", w),
  apartmentLiving: (w: number) => img("photo-1554995207-c18c203602cb", w),
  apartmentBuilding: (w: number) => img("photo-1521783988139-89397d761dce", w),
  apartmentKitchen: (w: number) => img("photo-1556911220-bff31c812dba", w),
  bedroomA: (w: number) => img("photo-1522771739844-6a9f6d5f14af", w),
  bedroomB: (w: number) => img("photo-1502672260266-1c1ef2d93688", w),
  bedroomC: (w: number) => img("photo-1517840901100-8179e982acb7", w),
  bedroomD: (w: number) => img("photo-1600210492486-724fe5c67fb0", w),
  bedroomE: (w: number) => img("photo-1631049307264-da0ec9d70304", w),
  bedroomF: (w: number) => img("photo-1598928506311-c55ded91a20c", w),
  bedroomG: (w: number) => img("photo-1595576508898-0ad5c879a061", w),
  breakfast: (w: number) => img("photo-1493770348161-369560ae357d", w),
  guestHouse: (w: number) => img("photo-1555854877-bab0e564b8d5", w),
};

const stays: Accommodation[] = [
  /* ------------------------------ Kathmandu ------------------------------ */
  {
    id: "ktm-royal-view",
    name: "The Royal View Hotel",
    type: "Hotel",
    city: "Kathmandu",
    neighborhood: "Lazimpat",
    address: "Durga Marg, Lazimpat, Kathmandu",
    image: U.hotelRoomA(900),
    gallery: [U.hotelRoomA(900), U.hotelExterior(900), U.hotelRoomB(900), U.resortPool(900)],
    badge: "Featured",
    description:
      "A refined city hotel with a rooftop terrace overlooking the Kathmandu valley, spa and all-day dining.",
    rating: 4.6,
    reviewCount: 312,
    pricePerNight: 8500,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included", "Parking", "Swimming Pool"],
    availableNow: true,
    distanceKm: 1.2,
    popularityScore: 92,
    isSample: true,
  },
  {
    id: "ktm-dwelling-house",
    name: "Dwelling House",
    type: "Guest House",
    city: "Kathmandu",
    neighborhood: "Thamel",
    address: "Jyatha, Thamel, Kathmandu",
    image: U.guestHouse(900),
    gallery: [U.guestHouse(900), U.bedroomB(900), U.breakfast(900), U.bedroomA(900)],
    badge: "Great Value",
    description:
      "A cozy heritage guest house tucked behind Thamel's lanes, with a garden courtyard and home-style breakfasts.",
    rating: 4.4,
    reviewCount: 208,
    pricePerNight: 3200,
    amenities: ["Free Wi-Fi", "Breakfast Included", "Pet Friendly", "Parking"],
    availableNow: true,
    distanceKm: 2.1,
    popularityScore: 78,
    isSample: true,
  },
  {
    id: "ktm-skyline-apartment",
    name: "Skyline Boutique Apartment",
    type: "Apartment",
    city: "Kathmandu",
    neighborhood: "Baluwatar",
    address: "Baluwatar, Kathmandu",
    image: U.apartmentInterior(900),
    gallery: [U.apartmentInterior(900), U.apartmentLiving(900), U.apartmentKitchen(900), U.bedroomA(900)],
    description:
      "A fully-furnished one-bedroom apartment with a modern kitchen, workspace and valley views from the balcony.",
    rating: 4.5,
    reviewCount: 96,
    pricePerNight: 5400,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Kitchen", "Parking"],
    availableNow: true,
    distanceKm: 1.8,
    popularityScore: 71,
    isSample: true,
  },
  {
    id: "ktm-gorkha-grand-villa",
    name: "Gorkha Grand Villa",
    type: "Villa",
    city: "Kathmandu",
    neighborhood: "Budhanilkantha",
    address: "Budhanilkantha, Kathmandu",
    image: U.villaPool(900),
    gallery: [U.villaPool(900), U.villaPoolSea(900), U.houseModern(900), U.bedroomC(900)],
    badge: "New",
    description:
      "A private 4-bedroom villa with a heated pool, landscaped garden and a dedicated helper — ideal for families.",
    rating: 4.7,
    reviewCount: 55,
    pricePerNight: 24000,
    amenities: ["Swimming Pool", "Free Wi-Fi", "Air Conditioning", "Parking", "Kitchen", "Pet Friendly"],
    availableNow: false,
    distanceKm: 6.4,
    popularityScore: 64,
    isSample: true,
  },
  {
    id: "ktm-courtyard-hotel",
    name: "Kathmandu Courtyard",
    type: "Hotel",
    city: "Kathmandu",
    neighborhood: "Durbar Marg",
    address: "Durbar Marg, Kathmandu",
    image: U.hotelRoomB(900),
    gallery: [U.hotelRoomB(900), U.hotelExteriorNight(900), U.hotelRoomC(900), U.resortPoolThree(900)],
    badge: "Popular",
    description:
      "Stylish rooms steps from Durbar Marg's cafés, with a rooftop bar, gym and 24-hour front desk.",
    rating: 4.5,
    reviewCount: 421,
    pricePerNight: 9900,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included", "Parking"],
    availableNow: true,
    distanceKm: 0.9,
    popularityScore: 95,
    isSample: true,
  },
  {
    id: "ktm-himalayan-haven",
    name: "Himalayan Haven Room",
    type: "Private Room",
    city: "Kathmandu",
    neighborhood: "Jhamsikhel",
    address: "Jhamsikhel, Lalitpur-Kathmandu border",
    image: U.bedroomB(900),
    gallery: [U.bedroomB(900), U.bedroomA(900), U.apartmentKitchen(900)],
    description:
      "A private room in a family-run home near Jhamsikhel's cafés, with shared common areas and free coffee.",
    rating: 4.3,
    reviewCount: 141,
    pricePerNight: 1900,
    amenities: ["Free Wi-Fi", "Breakfast Included", "Air Conditioning"],
    availableNow: true,
    distanceKm: 3.4,
    popularityScore: 58,
    isSample: true,
  },

  /* ------------------------------ Pokhara ------------------------------ */
  {
    id: "pkr-lakeside-panorama",
    name: "Lakeside Panorama Resort",
    type: "Hotel",
    city: "Pokhara",
    neighborhood: "Lakeside",
    address: "Baidam, Lakeside, Pokhara",
    image: U.resortPool(900),
    gallery: [U.resortPool(900), U.hotelRoomE(900), U.resortPoolTwo(900), U.bedroomD(900)],
    badge: "Popular",
    description:
      "An infinity-pool resort right on the lakefront, with mountain-view suites and a tranquil spa.",
    rating: 4.8,
    reviewCount: 389,
    pricePerNight: 11000,
    amenities: ["Swimming Pool", "Free Wi-Fi", "Breakfast Included", "Air Conditioning", "Mountain View"],
    availableNow: true,
    distanceKm: 0.4,
    popularityScore: 98,
    isSample: true,
  },
  {
    id: "pkr-phewa-villa",
    name: "Phewa Retreat Villa",
    type: "Villa",
    city: "Pokhara",
    neighborhood: "Lakeside",
    address: "Pame, Lakeside, Pokhara",
    image: U.villaPoolSea(900),
    gallery: [U.villaPoolSea(900), U.villaBeach(900), U.villaPool(900), U.bedroomE(900)],
    badge: "Featured",
    description:
      "A serene private villa facing Phewa Lake, with a plunge pool, terrace garden and chef on request.",
    rating: 5.0,
    reviewCount: 74,
    pricePerNight: 19000,
    amenities: ["Swimming Pool", "Free Wi-Fi", "Kitchen", "Air Conditioning", "Breakfast Included"],
    availableNow: true,
    distanceKm: 1.1,
    popularityScore: 88,
    isSample: true,
  },
  {
    id: "pkr-annapurna-guest",
    name: "Annapurna Base Guest House",
    type: "Guest House",
    city: "Pokhara",
    neighborhood: "Pame",
    address: "Pame, Pokhara",
    image: U.guestHouse(900),
    gallery: [U.guestHouse(900), U.bedroomG(900), U.breakfast(900)],
    badge: "Great Value",
    description:
      "Budget-friendly stays with warm hospitality, lake-facing balconies and a rooftop dining area.",
    rating: 4.2,
    reviewCount: 167,
    pricePerNight: 2800,
    amenities: ["Free Wi-Fi", "Breakfast Included", "Mountain View"],
    availableNow: true,
    distanceKm: 2.8,
    popularityScore: 66,
    isSample: true,
  },
  {
    id: "pkr-sarangkot-suite",
    name: "Sarangkot Sunrise Suite",
    type: "Apartment",
    city: "Pokhara",
    neighborhood: "Sarangkot",
    address: "Sarangkot, Pokhara",
    image: U.apartmentLiving(900),
    gallery: [U.apartmentLiving(900), U.bedroomF(900), U.apartmentKitchen(900)],
    description:
      "A self-catering suite perched on Sarangkot hill with jaw-dropping Annapurna and sunrise views.",
    rating: 4.6,
    reviewCount: 88,
    pricePerNight: 6500,
    amenities: ["Free Wi-Fi", "Kitchen", "Air Conditioning", "Mountain View"],
    availableNow: true,
    distanceKm: 5.2,
    popularityScore: 72,
    isSample: true,
  },
  {
    id: "pkr-mountain-view-room",
    name: "Mountain View Private Room",
    type: "Private Room",
    city: "Pokhara",
    neighborhood: "Lakeside",
    address: "Baidam, Lakeside, Pokhara",
    image: U.bedroomA(900),
    gallery: [U.bedroomA(900), U.bedroomD(900), U.resortPoolThree(900)],
    description:
      "A simple, spotless private room with mountains straight ahead — great value for trek-ready travellers.",
    rating: 3.9,
    reviewCount: 199,
    pricePerNight: 1800,
    amenities: ["Free Wi-Fi", "Mountain View"],
    availableNow: true,
    distanceKm: 0.7,
    popularityScore: 60,
    isSample: true,
  },
  {
    id: "pkr-fishtail-boutique",
    name: "Fishtail Boutique Hotel",
    type: "Hotel",
    city: "Pokhara",
    neighborhood: "Chhorepatan",
    address: "Chhorepatan, Pokhara",
    image: U.hotelRoomC(900),
    gallery: [U.hotelRoomC(900), U.hotelExterior(900), U.bedroomC(900), U.resortPoolTwo(900)],
    description:
      "A boutique hideaway with a courtyard pool, art-filled interiors and lake-butler service.",
    rating: 4.4,
    reviewCount: 233,
    pricePerNight: 7400,
    amenities: ["Free Wi-Fi", "Swimming Pool", "Breakfast Included", "Air Conditioning"],
    availableNow: true,
    distanceKm: 1.9,
    popularityScore: 80,
    isSample: true,
  },

  /* ------------------------------ Lalitpur ------------------------------ */
  {
    id: "ltp-paten-courtyard",
    name: "Patan Heritage Courtyard",
    type: "Hotel",
    city: "Lalitpur",
    neighborhood: "Patan Durbar Square",
    address: "Mangal Bazar, Lalitpur",
    image: U.hotelExteriorNight(900),
    gallery: [U.hotelExteriorNight(900), U.hotelRoomD(900), U.bedroomB(900), U.hotelExterior(900)],
    badge: "Featured",
    description:
      "A restored Newari courtyard hotel seconds from Patan Durbar Square, blending heritage craft with comfort.",
    rating: 4.7,
    reviewCount: 265,
    pricePerNight: 8200,
    amenities: ["Free Wi-Fi", "Breakfast Included", "Air Conditioning"],
    availableNow: true,
    distanceKm: 5.1,
    popularityScore: 86,
    isSample: true,
  },
  {
    id: "ltp-krishna-villa",
    name: "Krishna Villa",
    type: "Villa",
    city: "Lalitpur",
    neighborhood: "Bakhundole",
    address: "Bakhundole, Lalitpur",
    image: U.houseModern(900),
    gallery: [U.houseModern(900), U.villaPool(900), U.houseGarden(900), U.bedroomE(900)],
    description:
      "A modern family villa with a private garden and rooftop barbecue, close to embassies and cafés.",
    rating: 4.5,
    reviewCount: 63,
    pricePerNight: 15000,
    amenities: ["Free Wi-Fi", "Parking", "Kitchen", "Air Conditioning", "Pet Friendly"],
    availableNow: true,
    distanceKm: 6.8,
    popularityScore: 62,
    isSample: true,
  },
  {
    id: "ltp-bagmati-apartment",
    name: "Bagmati Riverside Apartment",
    type: "Apartment",
    city: "Lalitpur",
    neighborhood: "Pulchowk",
    address: "Pulchowk, Lalitpur",
    image: U.apartmentKitchen(900),
    gallery: [U.apartmentKitchen(900), U.apartmentInterior(900), U.bedroomF(900)],
    description:
      "A bright two-bedroom apartment near Pulchowk's tech and café hubs, with secure parking and fast Wi-Fi.",
    rating: 4.2,
    reviewCount: 121,
    pricePerNight: 5600,
    amenities: ["Free Wi-Fi", "Kitchen", "Parking", "Air Conditioning"],
    availableNow: false,
    distanceKm: 5.6,
    popularityScore: 74,
    isSample: true,
  },
  {
    id: "ltp-newari-homestay",
    name: "Newari Style Homestay Room",
    type: "Private Room",
    city: "Lalitpur",
    neighborhood: "Mangal Bazar",
    address: "Mangal Bazar, Lalitpur",
    image: U.bedroomF(900),
    gallery: [U.bedroomF(900), U.guestHouse(900), U.breakfast(900)],
    description:
      "Stay with a local Newari family near the durbar square — authentic meals, culture and warm hosting.",
    rating: 4.4,
    reviewCount: 152,
    pricePerNight: 2400,
    amenities: ["Free Wi-Fi", "Breakfast Included"],
    availableNow: true,
    distanceKm: 5.3,
    popularityScore: 70,
    isSample: true,
  },

  /* ------------------------------ Bhaktapur ------------------------------ */
  {
    id: "bkt-heritage-hotel",
    name: "Bhaktapur Heritage Hotel",
    type: "Hotel",
    city: "Bhaktapur",
    neighborhood: "Durbar Square",
    address: "Durbar Square, Bhaktapur",
    image: U.hotelRoomD(900),
    gallery: [U.hotelRoomD(900), U.hotelExteriorNight(900), U.bedroomA(900)],
    badge: "Popular",
    description:
      "Traditional rooftop hotel overlooking Bhaktapur's temples, with a cafe serving local juju dhau sweets.",
    rating: 4.6,
    reviewCount: 201,
    pricePerNight: 6800,
    amenities: ["Free Wi-Fi", "Breakfast Included", "Mountain View"],
    availableNow: true,
    distanceKm: 13.6,
    popularityScore: 84,
    isSample: true,
  },
  {
    id: "bkt-nyatapola-guest",
    name: "Nyatapola View Guest House",
    type: "Guest House",
    city: "Bhaktapur",
    neighborhood: "Taumadhi",
    address: "Taumadhi Tole, Bhaktapur",
    image: U.houseClassic(900),
    gallery: [U.houseClassic(900), U.bedroomC(900), U.breakfast(900)],
    description:
      "A charming guest house with windows framing the Nyatapola temple and brick-tiled bathrooms.",
    rating: 4.5,
    reviewCount: 142,
    pricePerNight: 3000,
    amenities: ["Free Wi-Fi", "Breakfast Included", "Air Conditioning"],
    availableNow: true,
    distanceKm: 13.3,
    popularityScore: 68,
    isSample: true,
  },
  {
    id: "bkt-pottery-sq-apartment",
    name: "Pottery Square Apartment",
    type: "Apartment",
    city: "Bhaktapur",
    neighborhood: "Pottery Square",
    address: "Pottery Square, Bhaktapur",
    image: U.apartmentInterior(900),
    gallery: [U.apartmentInterior(900), U.apartmentLiving(900), U.apartmentKitchen(900)],
    description:
      "An artsy loft above the famous pottery square — watch artisans at work from your studio window.",
    rating: 3.8,
    reviewCount: 77,
    pricePerNight: 3800,
    amenities: ["Free Wi-Fi", "Kitchen", "Air Conditioning"],
    availableNow: true,
    distanceKm: 13.8,
    popularityScore: 55,
    isSample: true,
  },
  {
    id: "bkt-dattatreya-villa",
    name: "Dattatreya Courtyard Villa",
    type: "Villa",
    city: "Bhaktapur",
    neighborhood: "Dattatreya",
    address: "Dattatreya Square, Bhaktapur",
    image: U.houseGarden(900),
    gallery: [U.houseGarden(900), U.villaBeach(900), U.bedroomG(900), U.houseModern(900)],
    badge: "New",
    description:
      "A restored courtyard villa with carved wood details, a private courtyard and rooftop city views.",
    rating: 4.8,
    reviewCount: 41,
    pricePerNight: 19800,
    amenities: ["Free Wi-Fi", "Parking", "Air Conditioning", "Breakfast Included"],
    availableNow: true,
    distanceKm: 14.1,
    popularityScore: 58,
    isSample: true,
  },

  /* ------------------------------ Nagarkot ------------------------------ */
  {
    id: "ngt-himalayan-sunrise",
    name: "Himalayan Sunrise Resort",
    type: "Hotel",
    city: "Nagarkot",
    neighborhood: "Nagarkot Hill",
    address: "Nagarkot Rd, Nagarkot",
    image: U.resortPoolTwo(900),
    gallery: [U.resortPoolTwo(900), U.hotelRoomE(900), U.resortPool(900), U.bedroomD(900)],
    badge: "Featured",
    description:
      "Perched on the hilltop ridge, this resort delivers the Himalayas from every room with heated pools.",
    rating: 4.9,
    reviewCount: 356,
    pricePerNight: 12500,
    amenities: ["Swimming Pool", "Free Wi-Fi", "Breakfast Included", "Air Conditioning", "Mountain View"],
    availableNow: true,
    distanceKm: 28.0,
    popularityScore: 93,
    isSample: true,
  },
  {
    id: "ngt-panorama-villa",
    name: "Nagarkot Panorama Villa",
    type: "Villa",
    city: "Nagarkot",
    neighborhood: "Nagarkot Hill",
    address: "Nagarkot, Bhaktapur",
    image: U.villaBeach(900),
    gallery: [U.villaBeach(900), U.houseModern(900), U.bedroomE(900), U.villaPool(900)],
    description:
      "A glass-fronted villa designed for sunrise watching, with a cedar sauna and mountain-view decks.",
    rating: 4.8,
    reviewCount: 88,
    pricePerNight: 22000,
    amenities: ["Free Wi-Fi", "Kitchen", "Air Conditioning", "Mountain View", "Pet Friendly"],
    availableNow: false,
    distanceKm: 27.4,
    popularityScore: 76,
    isSample: true,
  },
  {
    id: "ngt-sunrise-point-bnb",
    name: "Sunrise Point B&B Room",
    type: "Private Room",
    city: "Nagarkot",
    neighborhood: "Nagarkot Hill",
    address: "Nagarkot Tole, Nagarkot",
    image: U.bedroomD(900),
    gallery: [U.bedroomD(900), U.breakfast(900), U.bedroomE(900)],
    badge: "Great Value",
    description:
      "A snug en-suite room in a family B&B, famous for the 5 a.m. sunrise and fresh mountain breakfasts.",
    rating: 4.4,
    reviewCount: 178,
    pricePerNight: 3500,
    amenities: ["Free Wi-Fi", "Breakfast Included", "Mountain View"],
    availableNow: true,
    distanceKm: 27.9,
    popularityScore: 72,
    isSample: true,
  },
  {
    id: "ngt-cloud-forest-lodge",
    name: "Cloud Forest Lodge",
    type: "Guest House",
    city: "Nagarkot",
    neighborhood: "Kavre Forest",
    address: "Devisthan, Nagarkot",
    image: U.houseCottage(900),
    gallery: [U.houseCottage(900), U.houseGarden(900), U.bedroomB(900)],
    description:
      "A forest hut-style lodge wrapped in pines, with bonfire nights and guided sunrise hikes on call.",
    rating: 4.6,
    reviewCount: 95,
    pricePerNight: 5600,
    amenities: ["Free Wi-Fi", "Breakfast Included", "Mountain View", "Parking"],
    availableNow: true,
    distanceKm: 30.5,
    popularityScore: 69,
    isSample: true,
  },
];

export const ACCOMMODATIONS: Accommodation[] = stays;

export const POPULAR_LOCATIONS: PopularLocation[] = [
  {
    id: "loc-kathmandu",
    name: "Kathmandu",
    subtitle: "Valley cafés, heritage courtyards and city views",
    staysCount: ACCOMMODATIONS.filter((a) => a.city === "Kathmandu").length,
    image: img("photo-1544735716-392fe2489ffa", 900),
  },
  {
    id: "loc-pokhara",
    name: "Pokhara",
    subtitle: "Lakeside serenity framed by the Annapurnas",
    staysCount: ACCOMMODATIONS.filter((a) => a.city === "Pokhara").length,
    image: "/Pictures/Pokhara.jpeg",
  },
  {
    id: "loc-lalitpur",
    name: "Lalitpur",
    subtitle: "Newari art, durbar squares and artisan lanes",
    staysCount: ACCOMMODATIONS.filter((a) => a.city === "Lalitpur").length,
    image: img("photo-1580048915913-4f8f5cb481c4", 900),
  },
  {
    id: "loc-bhaktapur",
    name: "Bhaktapur",
    subtitle: "A living museum of brick, wood and pottery",
    staysCount: ACCOMMODATIONS.filter((a) => a.city === "Bhaktapur").length,
    image: img("photo-1610584401850-3a3d9a9e9b0d", 900),
  },
  {
    id: "loc-nagarkot",
    name: "Nagarkot",
    subtitle: "Himalayan sunrises above the clouds",
    staysCount: ACCOMMODATIONS.filter((a) => a.city === "Nagarkot").length,
    image: "/Pictures/Nagarkot.jpg",
  },
];

/** Currency label used across the accommodation UI. */
export const CURRENCY = "NPR";

/** Helper: number of nights between two ISO date strings ('' -> 0). */
export const nightsBetween = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return 0;
  return Math.max(1, Math.round((b - a) / 86_400_000));
};

/** Format a number as the local currency amount (e.g. NPR 12,500). */
export const formatPrice = (amount: number): string =>
  `${CURRENCY} ${amount.toLocaleString("en-IN")}`;