/* ==========================================================================
   Safiri Horizons — shared data module
   Single source of truth for destinations and journal articles, exposed on
   window.SH so every page (index, tours, destination, blog, article) can
   read the same records without duplicating content.
   ========================================================================== */

(function () {
  "use strict";

  const TOURS = [
    {
      id: "maasai-mara",
      name: "Maasai Mara Safari Explorer",
      country: "Kenya",
      category: "Safari",
      gradient: "g-savanna",
      image: "images/destinations/maasai-mara.svg",
      duration: "6 Days / 5 Nights",
      groupSize: "2–12 guests",
      price: 1850,
      bestTime: "July – October (Great Migration season)",
      mapPin: { x: 282, y: 240 },
      tagline: "Witness the Great Migration on the plains that made the safari famous.",
      description: "Track the Big Five across the endless grasslands of the Mara, share sundowners with the Maasai community, and wake up to lion calls beyond your tent canvas.",
      highlights: ["Big Five game drives with expert guides", "Maasai village cultural visit", "Hot air balloon safari (optional)", "Luxury tented camp stays", "Great Migration river crossings (seasonal)", "All park fees & transfers included"],
      itinerary: [
        { day: "Day 1", title: "Arrival in Nairobi", desc: "Land at Jomo Kenyatta International Airport, meet your guide, and transfer to a Nairobi lodge for the night." },
        { day: "Day 2", title: "Fly to the Mara", desc: "Short scenic flight into the Maasai Mara; afternoon game drive across the open plains." },
        { day: "Days 3–4", title: "Full safari immersion", desc: "Sunrise and sunset game drives tracking lion, elephant, and (seasonally) the Great Migration river crossings." },
        { day: "Day 5", title: "Maasai village & culture", desc: "Morning game drive followed by a visit to a local Maasai village to learn traditional customs." },
        { day: "Day 6", title: "Departure", desc: "Final sunrise drive, then fly back to Nairobi for your onward flight home." }
      ],
      includes: ["Accommodation as listed", "All park & conservancy fees", "Professional safari guide", "Ground transport & domestic flight", "Most meals (full board on safari)"],
      excludes: ["International flights", "Visa fees", "Travel insurance", "Hot air balloon safari (optional add-on)", "Personal expenses & gratuities"],
      featured: true
    },
    {
      id: "serengeti-ngorongoro",
      name: "Serengeti & Ngorongoro Crater",
      country: "Tanzania",
      category: "Safari",
      gradient: "g-sunset",
      image: "images/destinations/serengeti-ngorongoro.svg",
      duration: "8 Days / 7 Nights",
      groupSize: "2–10 guests",
      price: 2450,
      bestTime: "June – September & January – February",
      mapPin: { x: 266, y: 264 },
      tagline: "Endless plains, a wildlife-packed caldera, and skies full of stars.",
      description: "Descend into the Ngorongoro Crater's natural amphitheatre and roam the Serengeti's limitless horizon on one of Africa's most celebrated safari circuits.",
      highlights: ["Ngorongoro Crater floor game drive", "Serengeti central & northern circuits", "Olduvai Gorge historical stop", "Private safari vehicle with pop-up roof", "Award-winning eco lodges", "Professional English/French-speaking guide"],
      itinerary: [
        { day: "Day 1", title: "Arrival in Arusha", desc: "Meet your guide and settle in before heading into the highlands." },
        { day: "Days 2–3", title: "Ngorongoro Crater", desc: "Descend into the crater floor for a full day among dense wildlife concentrations." },
        { day: "Day 4", title: "Olduvai Gorge", desc: "Visit the site of major early-human fossil discoveries en route to the Serengeti." },
        { day: "Days 5–7", title: "Serengeti plains", desc: "Multiple game drives across central and northern Serengeti, timed to migration patterns." },
        { day: "Day 8", title: "Departure", desc: "Final morning drive, then transfer to Kilimanjaro International Airport." }
      ],
      includes: ["Accommodation as listed", "All park & crater fees", "4x4 safari vehicle with guide", "Full board on safari", "Airport transfers"],
      excludes: ["International flights", "Visa fees", "Travel insurance", "Tipping", "Alcoholic beverages"]
    },
    {
      id: "victoria-falls",
      name: "Victoria Falls Adventure",
      country: "Zambia & Zimbabwe",
      category: "Waterfalls & Adventure",
      gradient: "g-ocean",
      image: "images/destinations/victoria-falls.svg",
      duration: "5 Days / 4 Nights",
      groupSize: "2–14 guests",
      price: 1600,
      bestTime: "February – May (peak water flow)",
      mapPin: { x: 228, y: 322 },
      tagline: "Stand where the Zambezi thunders into the earth — 'The Smoke That Thunders'.",
      description: "Feel the spray of one of the Seven Natural Wonders of the World, then choose your thrill: white-water rafting, bungee, microlight flights, or a sunset river cruise.",
      highlights: ["Guided Victoria Falls rainforest walk", "White-water rafting on the Zambezi (optional)", "Sunset booze cruise with live music", "Devil's Pool experience (seasonal)", "4-star riverside accommodation", "Cross-border Zambia/Zimbabwe transfers"],
      itinerary: [
        { day: "Day 1", title: "Arrival at the Falls", desc: "Transfer to your riverside lodge and settle in with views of the Zambezi." },
        { day: "Day 2", title: "Falls rainforest walk", desc: "Guided walk along the rim of Victoria Falls, umbrella in hand for the spray." },
        { day: "Day 3", title: "Adventure day", desc: "Choose white-water rafting, bungee jumping, or a gentler gorge walk." },
        { day: "Day 4", title: "Sunset river cruise", desc: "Free morning, then a Zambezi sunset cruise with drinks and live music." },
        { day: "Day 5", title: "Departure", desc: "Transfer to Victoria Falls Airport for your onward flight." }
      ],
      includes: ["Accommodation as listed", "Rainforest walk entry fees", "Sunset cruise", "Airport transfers", "Daily breakfast"],
      excludes: ["International flights", "Visa fees (both sides of the border)", "Adventure activity fees", "Travel insurance", "Lunches & dinners"]
    },
    {
      id: "sahara-morocco",
      name: "Sahara Desert Expedition",
      country: "Morocco",
      category: "Desert & Culture",
      gradient: "g-dune",
      image: "images/destinations/sahara-morocco.svg",
      duration: "7 Days / 6 Nights",
      groupSize: "2–16 guests",
      price: 1750,
      bestTime: "March – May & October – November",
      mapPin: { x: 116, y: 50 },
      tagline: "Camel treks, star-lit camps, and the golden dunes of Erg Chebbi.",
      description: "Wind through the Atlas Mountains and Kasbah-lined valleys before bedding down under the stars in a private Berber-style desert camp.",
      highlights: ["Camel trek into Erg Chebbi dunes", "Overnight luxury desert camp", "Atlas Mountains & Todra Gorge", "Traditional Berber villages", "Marrakech medina walking tour", "All breakfasts & desert dinners"],
      itinerary: [
        { day: "Day 1", title: "Arrival in Marrakech", desc: "Settle into a traditional riad in the medina." },
        { day: "Day 2", title: "Over the Atlas Mountains", desc: "Drive the High Atlas pass, stopping in Berber villages en route to Dades Valley." },
        { day: "Day 3", title: "Todra Gorge", desc: "Explore the dramatic limestone canyon before continuing toward the desert." },
        { day: "Day 4", title: "Into the Sahara", desc: "Camel trek across Erg Chebbi's dunes to a private desert camp for the night." },
        { day: "Days 5–6", title: "Return via the valleys", desc: "Journey back through Kasbah-lined valleys, arriving in Marrakech." },
        { day: "Day 7", title: "Departure", desc: "Final morning in the souks before your transfer to the airport." }
      ],
      includes: ["Riad & desert camp accommodation", "Camel trek", "Private air-conditioned vehicle", "Daily breakfast & desert dinners", "English-speaking driver-guide"],
      excludes: ["International flights", "Visa fees (if applicable)", "Lunches", "Travel insurance", "Tipping"]
    },
    {
      id: "zanzibar",
      name: "Zanzibar Beach Escape",
      country: "Tanzania",
      category: "Beach & Islands",
      gradient: "g-ocean",
      image: "images/destinations/zanzibar.svg",
      duration: "6 Days / 5 Nights",
      groupSize: "2–10 guests",
      price: 1450,
      bestTime: "June – October (dry season)",
      mapPin: { x: 290, y: 278 },
      tagline: "Powder-white sand, spice-scented lanes, and turquoise Indian Ocean water.",
      description: "Unwind on Zanzibar's postcard beaches, snorkel vibrant reefs, and wander the UNESCO-listed alleys of Stone Town between spa treatments.",
      highlights: ["Beachfront boutique resort", "Stone Town UNESCO walking tour", "Spice farm tour & tasting", "Safari Blue snorkelling cruise", "Sunset dhow cruise", "Airport transfers included"],
      itinerary: [
        { day: "Day 1", title: "Arrival & Stone Town", desc: "Transfer to Stone Town for a guided walk through its UNESCO-listed alleys." },
        { day: "Day 2", title: "Spice farm tour", desc: "Visit a working spice farm and taste Zanzibar's famous cloves, vanilla, and cinnamon." },
        { day: "Days 3–4", title: "Beach time", desc: "Relax at your beachfront resort with optional snorkelling and water sports." },
        { day: "Day 5", title: "Safari Blue cruise", desc: "Full-day sailing and snorkelling cruise with a seafood lunch on a sandbank." },
        { day: "Day 6", title: "Departure", desc: "Free morning before transfer to Zanzibar Airport." }
      ],
      includes: ["Resort accommodation", "Stone Town tour", "Spice farm tour", "Safari Blue cruise", "Airport transfers", "Daily breakfast"],
      excludes: ["International flights", "Visa fees", "Travel insurance", "Lunches & dinners (except cruise day)", "Water sports equipment rental"],
      featured: true
    },
    {
      id: "cape-town",
      name: "Cape Town & Cape Winelands",
      country: "South Africa",
      category: "Culture & City",
      gradient: "g-forest",
      image: "images/destinations/cape-town.svg",
      duration: "6 Days / 5 Nights",
      groupSize: "2–12 guests",
      price: 1950,
      bestTime: "November – March (warm, dry summer)",
      mapPin: { x: 198, y: 392 },
      tagline: "Table Mountain views, penguin colonies, and world-class vineyards.",
      description: "Ride the cableway up Table Mountain, meet the penguins of Boulders Beach, and sip award-winning wines across Stellenbosch and Franschhoek.",
      highlights: ["Table Mountain cableway", "Cape Peninsula & Boulders Beach tour", "Stellenbosch & Franschhoek wine tasting", "Robben Island ferry (optional)", "Boutique hotel in the City Bowl", "Private driver-guide throughout"],
      itinerary: [
        { day: "Day 1", title: "Arrival in Cape Town", desc: "Settle into your City Bowl hotel with time to explore the V&A Waterfront." },
        { day: "Day 2", title: "Table Mountain", desc: "Cableway ride to the summit (weather permitting), then central city walking tour." },
        { day: "Day 3", title: "Cape Peninsula", desc: "Full-day tour to Boulders Beach penguins, Cape Point, and Chapman's Peak Drive." },
        { day: "Day 4", title: "Cape Winelands", desc: "Full-day tasting tour through Stellenbosch and Franschhoek." },
        { day: "Day 5", title: "Free day", desc: "Optional Robben Island ferry or leisure time in the city." },
        { day: "Day 6", title: "Departure", desc: "Transfer to Cape Town International Airport." }
      ],
      includes: ["Hotel accommodation", "Table Mountain cableway ticket", "Cape Peninsula tour", "Wine tasting tour", "Private driver-guide", "Daily breakfast"],
      excludes: ["International flights", "Visa fees", "Robben Island ferry (optional)", "Travel insurance", "Lunches & dinners"],
      featured: true
    },
    {
      id: "okavango-delta",
      name: "Okavango Delta Safari",
      country: "Botswana",
      category: "Safari",
      gradient: "g-savanna",
      image: "images/destinations/okavango-delta.svg",
      duration: "7 Days / 6 Nights",
      groupSize: "2–8 guests",
      price: 2850,
      bestTime: "May – September (dry, high water)",
      mapPin: { x: 206, y: 336 },
      tagline: "Glide by mokoro canoe through Africa's lush inland river delta.",
      description: "Swap dusty roads for silent waterways in the Okavango's UNESCO World Heritage wetlands, home to elephant herds, hippos, and rare wild dogs.",
      highlights: ["Traditional mokoro canoe excursions", "Island bush walks with trackers", "Premium tented safari camps", "Light-aircraft transfers between camps", "Small group, low-impact travel", "Full-board gourmet dining"],
      itinerary: [
        { day: "Day 1", title: "Arrival in Maun", desc: "Meet your guide and take a light-aircraft transfer into the Delta." },
        { day: "Days 2–3", title: "First camp: water safari", desc: "Mokoro canoe excursions through the reed-lined channels, spotting hippo and elephant." },
        { day: "Days 4–5", title: "Second camp: bush walks", desc: "Fly to a second concession for guided walking safaris with expert trackers." },
        { day: "Day 6", title: "Final game drives", desc: "Morning and evening drives focused on predator sightings." },
        { day: "Day 7", title: "Departure", desc: "Light-aircraft transfer back to Maun for your onward flight." }
      ],
      includes: ["Tented camp accommodation", "All activities (mokoro, walks, drives)", "Light-aircraft transfers between camps", "Full board & most drinks", "Park & concession fees"],
      excludes: ["International flights", "Visa fees", "Travel insurance", "Premium spirits", "Gratuities"]
    },
    {
      id: "egypt-pyramids",
      name: "Pyramids & Nile Discovery",
      country: "Egypt",
      category: "Desert & Culture",
      gradient: "g-dune",
      image: "images/destinations/egypt-pyramids.svg",
      duration: "8 Days / 7 Nights",
      groupSize: "2–16 guests",
      price: 2100,
      bestTime: "October – April (cooler months)",
      mapPin: { x: 268, y: 68 },
      tagline: "From the Giza plateau to a timeless cruise down the Nile.",
      description: "Trace 5,000 years of history from the Great Pyramids and Sphinx to the temples of Luxor and Aswan, aboard a classic Nile river cruise.",
      highlights: ["Giza Pyramids & Sphinx tour", "4-night Nile cruise (Luxor–Aswan)", "Valley of the Kings & Karnak Temple", "Egyptian Museum in Cairo", "Felucca sunset sail", "Domestic flights included"],
      itinerary: [
        { day: "Days 1–2", title: "Cairo & Giza", desc: "Explore the Pyramids, the Sphinx, and the Egyptian Museum's treasures." },
        { day: "Day 3", title: "Fly to Luxor", desc: "Board your Nile cruise ship and visit Karnak Temple." },
        { day: "Day 4", title: "Valley of the Kings", desc: "Cross to the West Bank for the royal tombs and the Temple of Hatshepsut." },
        { day: "Days 5–6", title: "Cruising to Aswan", desc: "Sail south, stopping at Edfu and Kom Ombo temples along the way." },
        { day: "Day 7", title: "Aswan & felucca sail", desc: "Visit the High Dam and Philae Temple, then a sunset felucca sail on the Nile." },
        { day: "Day 8", title: "Departure", desc: "Fly back to Cairo for your international departure." }
      ],
      includes: ["Hotel & Nile cruise accommodation", "Domestic flights (Cairo–Luxor, Aswan–Cairo)", "All entrance fees listed", "Daily breakfast + meals on cruise", "Egyptologist guide throughout"],
      excludes: ["International flights", "Egypt visa fees", "Travel insurance", "Hot air balloon over Luxor (optional)", "Gratuities"]
    },
    {
      id: "kruger",
      name: "Kruger National Park Big Five",
      country: "South Africa",
      category: "Safari",
      gradient: "g-savanna",
      image: "images/destinations/kruger.svg",
      duration: "5 Days / 4 Nights",
      groupSize: "2–12 guests",
      price: 1700,
      bestTime: "May – September (dry season)",
      mapPin: { x: 244, y: 358 },
      tagline: "One of Africa's greatest game reserves, built for first-time safari-goers.",
      description: "Twice-daily game drives across Kruger's private concessions offer some of the continent's most reliable Big Five sightings, paired with relaxed bush lodges.",
      highlights: ["Sunrise & sunset open-vehicle game drives", "Big Five private concession access", "Guided bush walks", "Malaria-risk guidance & support", "All-inclusive lodge dining", "Ranger-led night drives"],
      itinerary: [
        { day: "Day 1", title: "Arrival & first game drive", desc: "Fly into the region, transfer to your bush lodge, and head straight out on an afternoon drive." },
        { day: "Days 2–3", title: "Full safari rhythm", desc: "Sunrise and sunset game drives, with a guided bush walk on one morning." },
        { day: "Day 4", title: "Night drive", desc: "A ranger-led night drive to spot nocturnal predators, plus a relaxed spa or pool morning." },
        { day: "Day 5", title: "Departure", desc: "Final sunrise drive, then transfer to the airport." }
      ],
      includes: ["Lodge accommodation", "All game drives & bush walk", "Park & concession fees", "Full board", "Return airstrip transfers"],
      excludes: ["International & domestic flights", "Visa fees", "Travel insurance", "Premium drinks", "Gratuities"]
    },
    {
      id: "rwanda-gorillas",
      name: "Rwanda Gorilla Trekking",
      country: "Rwanda",
      category: "Mountains & Trekking",
      gradient: "g-forest",
      image: "images/destinations/rwanda-gorillas.svg",
      duration: "4 Days / 3 Nights",
      groupSize: "2–6 guests",
      price: 3200,
      bestTime: "June – September & December – February (dry seasons)",
      mapPin: { x: 252, y: 226 },
      tagline: "A once-in-a-lifetime hour face-to-face with mountain gorillas.",
      description: "Trek the misty slopes of Volcanoes National Park with expert trackers for a rare, closely regulated encounter with endangered mountain gorilla families.",
      highlights: ["Gorilla trekking permit included", "Small-group guided trek", "Golden monkey tracking (optional)", "Kigali city & genocide memorial tour", "Boutique volcano-view lodge", "Porter support for the trek"],
      itinerary: [
        { day: "Day 1", title: "Arrival in Kigali", desc: "City tour including the Kigali Genocide Memorial, then transfer to Volcanoes National Park." },
        { day: "Day 2", title: "Gorilla trekking", desc: "Early start into the forest, trekking with rangers to spend a regulated hour with a gorilla family." },
        { day: "Day 3", title: "Golden monkeys or rest", desc: "Optional golden monkey tracking, or a relaxed morning at your lodge with volcano views." },
        { day: "Day 4", title: "Departure", desc: "Transfer back to Kigali for your international flight." }
      ],
      includes: ["Lodge accommodation", "Gorilla trekking permit", "Porter fee", "All transfers", "Full board"],
      excludes: ["International flights", "Rwanda visa fees", "Golden monkey permit (optional)", "Travel insurance", "Gratuities for trackers & porters"]
    },
    {
      id: "seychelles",
      name: "Seychelles Island Retreat",
      country: "Seychelles",
      category: "Beach & Islands",
      gradient: "g-ocean",
      image: "images/destinations/seychelles.svg",
      duration: "7 Days / 6 Nights",
      groupSize: "2–8 guests",
      price: 2650,
      bestTime: "April – May & October – November (calmest seas)",
      mapPin: { x: 344, y: 248 },
      tagline: "Granite boulders, castaway beaches, and barefoot island luxury.",
      description: "Island-hop between Mahé, Praslin, and La Digue by boat, snorkelling coral gardens and lounging on beaches routinely ranked among the world's best.",
      highlights: ["Multi-island itinerary by boat", "Vallée de Mai UNESCO nature reserve", "Anse Source d'Argent beach day", "Snorkelling & marine park excursions", "Overwater & beachfront villas", "Honeymoon upgrades available"],
      itinerary: [
        { day: "Days 1–2", title: "Mahé", desc: "Arrival and time to explore Victoria and Mahé's beaches." },
        { day: "Days 3–4", title: "Praslin", desc: "Ferry to Praslin; visit the Vallée de Mai UNESCO reserve and its famous coco de mer palms." },
        { day: "Days 5–6", title: "La Digue", desc: "Cycle the car-free island and spend a full day at Anse Source d'Argent." },
        { day: "Day 7", title: "Departure", desc: "Return ferry to Mahé for your international flight." }
      ],
      includes: ["Villa accommodation on each island", "Inter-island ferry transfers", "Vallée de Mai entrance fee", "Daily breakfast", "Airport transfers"],
      excludes: ["International flights", "Travel insurance", "Snorkelling equipment rental", "Lunches & dinners", "Gratuities"]
    },
    {
      id: "marrakech",
      name: "Marrakech Imperial Cities",
      country: "Morocco",
      category: "Desert & Culture",
      gradient: "g-dune",
      image: "images/destinations/marrakech.svg",
      duration: "6 Days / 5 Nights",
      groupSize: "2–16 guests",
      price: 1550,
      bestTime: "March – May & September – November",
      mapPin: { x: 118, y: 54 },
      tagline: "Souks, palaces, and riad courtyards across Morocco's imperial cities.",
      description: "Explore the labyrinth souks of Marrakech, the blue lanes of Chefchaouen, and the royal palaces of Fez and Meknes on a culture-first journey.",
      highlights: ["Marrakech medina & souk tour", "Bahia Palace & Majorelle Garden", "Fez & Meknes imperial cities", "Traditional riad accommodation", "Hammam spa experience", "Private air-conditioned transport"],
      itinerary: [
        { day: "Days 1–2", title: "Marrakech", desc: "Explore the medina souks, Bahia Palace, and Majorelle Garden; evening at a hammam spa." },
        { day: "Day 3", title: "To Fez via Middle Atlas", desc: "Scenic drive through cedar forests to the imperial city of Fez." },
        { day: "Day 4", title: "Fez old city", desc: "Guided walk through the world's largest car-free urban area and its historic tanneries." },
        { day: "Day 5", title: "Meknes & Volubilis", desc: "Day trip to the imperial city of Meknes and the Roman ruins of Volubilis." },
        { day: "Day 6", title: "Departure", desc: "Return transfer to Marrakech or Fez airport." }
      ],
      includes: ["Riad accommodation", "Private air-conditioned transport", "Guided city tours", "Daily breakfast", "Hammam spa session"],
      excludes: ["International flights", "Visa fees (if applicable)", "Lunches & dinners", "Travel insurance", "Tipping"]
    }
  ];

  const BLOG = [
    {
      slug: "best-time-to-visit-serengeti",
      title: "The Best Time to Visit the Serengeti (and Why Timing Changes Everything)",
      excerpt: "The Great Migration doesn't follow a calendar, but decades of pattern give you good odds. Here's how to time a Serengeti trip around it.",
      category: "Planning",
      readTime: "6 min read",
      gradient: "g-sunset",
      relatedTour: "serengeti-ngorongoro",
      body: [
        "Ask ten seasoned safari guides when to visit the Serengeti and you'll get ten slightly different answers — because the honest answer is that the Serengeti rewards visitors year-round, just for different reasons.",
        "If your priority is the Great Migration's dramatic river crossings, aim for July through September, when over a million wildebeest and zebra push north through the Grumeti and Mara rivers in the western and northern Serengeti. This is peak season: book your lodge six to nine months ahead.",
        "If you'd rather see the plains at their most fertile — calving season, with newborn wildebeest and the predator action that follows them — head to the southern Serengeti and Ndutu area between late January and March. This period also tends to have thinner crowds and better lodge availability.",
        "The 'green season' from April to May brings short, sharp rains, lush scenery, and dramatically lower prices, though some roads become harder to navigate and a handful of camps close for maintenance.",
        "Our rule of thumb for first-time visitors: pair the Serengeti with the Ngorongoro Crater, which delivers reliably dense wildlife viewing in a compact area no matter the month — a smart hedge if your travel dates are fixed rather than flexible.",
        "Whatever window you choose, build in at least three full days in the park. Wildlife sightings are a numbers game, and rushing a Serengeti safari is the single most common regret we hear from returning travellers."
      ]
    },
    {
      slug: "packing-list-african-safari",
      title: "The Complete Packing List for Your First African Safari",
      excerpt: "Neutral colours, layers, and a good pair of binoculars — what actually matters when you're packing for the bush.",
      category: "Travel Tips",
      readTime: "7 min read",
      gradient: "g-savanna",
      relatedTour: "maasai-mara",
      body: [
        "Safari packing has a reputation for being complicated. It isn't — you just need the right handful of items, not a suitcase full of gear you'll never use.",
        "Clothing: pack neutral, muted colours — khaki, olive, tan — and avoid bright white, black, and camouflage (the latter is restricted for civilians in several African countries). Layers matter more than any single garment: mornings on an open game vehicle are genuinely cold, even near the equator, and midday sun is intense. A fleece or light jacket, a wide-brimmed hat, and a buff or scarf for dust cover the essentials.",
        "Footwear: comfortable closed-toe shoes for game drives, plus sandals for camp. Unless your itinerary includes a dedicated trek (gorilla trekking, for example), you don't need heavy hiking boots.",
        "Gear: binoculars are the one item worth spending real money on — a decent 8x42 pair transforms distant sightings into memorable ones. Bring a camera with some zoom reach if wildlife photography matters to you, along with extra batteries and memory cards; charging outlets are limited at remote camps.",
        "Health & practical: check malaria prophylaxis with your doctor well before departure, pack a basic first-aid kit, high-SPF sunscreen, insect repellent, and any prescription medication in carry-on luggage. Many light aircraft transfers between camps enforce strict luggage weight limits (often 15kg in a soft-sided bag) — we'll confirm exact limits for your specific itinerary once booked.",
        "Finally: pack lighter than you think you need to. Most camps offer next-day laundry service, and a lean bag makes every transfer easier."
      ]
    },
    {
      slug: "zanzibar-vs-seychelles",
      title: "Zanzibar or Seychelles? How to Choose Your African Beach Escape",
      excerpt: "Both are postcard-perfect. The right choice depends on budget, vibe, and how much culture you want alongside your sand.",
      category: "Destinations",
      readTime: "5 min read",
      gradient: "g-ocean",
      relatedTour: "zanzibar",
      body: [
        "Zanzibar and the Seychelles both deliver the turquoise-water, white-sand fantasy — but they're genuinely different trips, and picking the right one makes a real difference to how your holiday feels.",
        "Zanzibar is layered with history and culture: Stone Town's UNESCO-listed alleys, centuries of Swahili, Arab, and Indian trading influence, and spice farms you can walk through and taste. It pairs naturally with an East African safari — many of our guests combine a few days in the Serengeti or Maasai Mara with a Zanzibar beach finish, flying between the two in under two hours.",
        "The Seychelles is quieter and more remote — 115 islands scattered in the Indian Ocean, famous for the giant granite boulders that frame beaches like Anse Source d'Argent. It's less about culture and more about pure, barefoot island escape, with some of the best snorkelling and diving in the region.",
        "On budget: Zanzibar is generally the more affordable of the two, with a wider range of accommodation styles from boutique guesthouses to five-star resorts. The Seychelles skews upmarket across the board, reflecting its remoteness and smaller-scale tourism infrastructure.",
        "Our honest take: choose Zanzibar if you want culture and a natural safari pairing; choose the Seychelles if total seclusion and being able to say 'we saw almost no one else' matters most. Either way, both deliver exceptional diving and snorkelling — book during the regional dry season (June–October) for the calmest water."
      ]
    },
    {
      slug: "africa-travel-documents-guide",
      title: "Visas, Vaccinations & Travel Documents: A Practical Guide for Africa-Bound Travellers",
      excerpt: "What to sort out before you fly — and why 'I'll figure it out on arrival' is the wrong strategy for African travel.",
      category: "Planning",
      readTime: "6 min read",
      gradient: "g-forest",
      relatedTour: null,
      body: [
        "Requirements vary enormously by nationality and destination country, and they change over time — this article is a starting checklist, not a substitute for checking current rules with the relevant embassy or consulate before you travel.",
        "Visas: many African countries now offer e-visas or visa-on-arrival for a wide range of nationalities, which has made entry significantly smoother over the past decade. Kenya, Tanzania, and Rwanda, for example, operate straightforward e-visa systems most travellers can complete online in advance. Others still require an in-person application at an embassy. We confirm the specific requirement for your passport and itinerary as part of every booking.",
        "Vaccinations: a Yellow Fever certificate is a hard entry requirement for several countries if you're arriving from (or have transited through) a country with risk of transmission — travellers sometimes assume it only applies to their departure country, which is a common and costly mistake. Speak to a travel health clinic 4–6 weeks before departure about Yellow Fever, Hepatitis A/B, Typhoid, and malaria prophylaxis appropriate to your specific route.",
        "Passport validity: the common rule across most African countries is six months of validity remaining beyond your travel dates, plus at least two to three blank visa pages. Renew early if you're close to the line — this is the single most common reason travellers get denied boarding.",
        "Travel insurance: not always legally required, but always worth having, and increasingly mandatory for activities like gorilla trekking permits and some overland border crossings. Make sure your policy explicitly covers medical evacuation, which matters more in remote safari areas than almost anywhere else you're likely to travel.",
        "Our team sends every confirmed traveller a destination-specific documents checklist as part of your booking confirmation, so nothing is left to guesswork close to departure."
      ]
    }
  ];

  window.SH = { TOURS, BLOG };
})();
