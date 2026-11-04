/**
 * Jadoo Travel Landing Page - Mock Data
 * Contains destinations and testimonials arrays for dynamic rendering.
 */

export const destinations = [
  {
    id: 1,
    city: "Rome",
    country: "Italy",
    price: 5420,
    priceFormatted: "$5.42k",
    days: 10,
    image: "assets/images/rome.jpg",
    rating: 4.9,
    reviews: 248,
    category: "Historical & Cultural",
    description: "Explore the ancient Colosseum, throw a coin into the Trevi Fountain, stroll through Vatican City, and indulge in authentic Roman trattorias."
  },
  {
    id: 2,
    city: "London",
    country: "UK",
    price: 4200,
    priceFormatted: "$4.2k",
    days: 12,
    image: "assets/images/london.jpg",
    rating: 4.8,
    reviews: 195,
    category: "City & Architecture",
    description: "Experience the vibrant heart of the UK with Big Ben, the iconic Tower Bridge, West End theatre shows, and picturesque royal parks."
  },
  {
    id: 3,
    city: "Full Europe",
    country: "Europe",
    price: 15000,
    priceFormatted: "$15k",
    days: 28,
    image: "assets/images/europe.jpg",
    rating: 4.95,
    reviews: 312,
    category: "Grand Continental Tour",
    description: "An unforgettable 28-day grand journey across Helsinki, Scandinavia, Central Europe, the Swiss Alps, and the Mediterranean coastline."
  },
  {
    id: 4,
    city: "Santorini",
    country: "Greece",
    price: 3850,
    priceFormatted: "$3.85k",
    days: 8,
    image: "assets/images/santorini.jpg",
    rating: 4.92,
    reviews: 220,
    category: "Island & Romance",
    description: "Witness breathtaking caldera sunsets in Oia, relax on red and black volcanic beaches, and savor fresh Aegean seafood overlooking the sapphire sea."
  },
  {
    id: 5,
    city: "Tokyo",
    country: "Japan",
    price: 6800,
    priceFormatted: "$6.8k",
    days: 14,
    image: "assets/images/tokyo.jpg",
    rating: 4.91,
    reviews: 184,
    category: "Modern & Heritage",
    description: "Discover a mesmerizing blend of ultramodern skyscrapers and ancient Shinto shrines, Michelin-starred cuisine, and neon-lit Shibuya streets."
  },
  {
    id: 6,
    city: "Paris",
    country: "France",
    price: 4600,
    priceFormatted: "$4.6k",
    days: 9,
    image: "assets/images/paris.jpg",
    rating: 4.86,
    reviews: 265,
    category: "Art & Romance",
    description: "Fall in love with the City of Light, from the heights of the Eiffel Tower and masterpieces of the Louvre to quaint Montmartre cafes."
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Mike Taylor",
    role: "Travel Enthusiast & Photographer",
    location: "Lahore, Pakistan",
    quote: "On the Windows talking painted pasture yet its express parties use. Sure last upon he same as knew next. Of believed or diverted no. Jadoo made booking our multi-city trip completely stress-free.",
    avatar: "assets/images/avatar-mike.jpg"
  },
  {
    id: 2,
    name: "Chris Thomas",
    role: "CEO of Red Button",
    location: "London, UK",
    quote: "The curated recommendations and transparent pricing saved our corporate retreat team days of planning. Truly the most reliable travel partner we have ever worked with.",
    avatar: "assets/images/avatar-chris.jpg"
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Solo Explorer & Architect",
    location: "Melbourne, Australia",
    quote: "Booking my solo expedition through Europe was effortless. The personalized daily itinerary and 24/7 airport assistance made every transition seamless and safe.",
    avatar: "assets/images/avatar-sarah.jpg"
  }
];

// Fallback attachment for direct file:// browser access
if (typeof window !== "undefined") {
  window.jadooData = { destinations, testimonials };
}
