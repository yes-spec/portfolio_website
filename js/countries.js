/* ==========================================================================
   Safiri Horizons — country reference data for the interactive Africa map
   Keyed by the exact "name" property in data/africa-countries.geojson.json
   (Natural Earth via the world-atlas dataset) so the map can look each
   country up directly from what it just hovered. `hasTours: true` marks a
   country with a bookable Safiri Horizons journey (see js/data.js TOURS) —
   the map highlights those and clicking one filters the tour grid.
   ========================================================================== */

(function () {
  "use strict";

  const COUNTRY_INFO = {
    "Algeria": { display: "Algeria", topAreas: ["Algiers' Casbah", "Sahara dunes at Taghit", "Roman ruins of Timgad"] },
    "Angola": { display: "Angola", topAreas: ["Luanda's Marginal", "Kalandula Falls", "Kissama National Park"] },
    "Botswana": { display: "Botswana", topAreas: ["Okavango Delta", "Chobe National Park", "Kalahari salt pans"], hasTours: true, searchTerm: "botswana" },
    "Burundi": { display: "Burundi", topAreas: ["Lake Tanganyika shores", "Bujumbura", "Kibira National Park"] },
    "Cameroon": { display: "Cameroon", topAreas: ["Mount Cameroon", "Waza National Park", "Limbe's beaches"] },
    "Cabo Verde": { display: "Cabo Verde", topAreas: ["Santa Maria beaches, Sal", "Fogo volcano", "Mindelo, São Vicente"] },
    "Central African Rep.": { display: "Central African Republic", topAreas: ["Dzanga-Sangha rainforest", "Bangui", "Chinko Nature Reserve"] },
    "Chad": { display: "Chad", topAreas: ["Zakouma National Park", "Ennedi Massif", "Lake Chad"] },
    "Comoros": { display: "Comoros", topAreas: ["Mount Karthala, Grande Comore", "Mohéli marine park", "Moroni's old town"] },
    "Congo": { display: "Republic of the Congo", topAreas: ["Odzala-Kokoua National Park", "Brazzaville", "Congo River"] },
    "Dem. Rep. Congo": { display: "DR Congo", topAreas: ["Virunga National Park", "Kinshasa", "Congo River rainforest"] },
    "Benin": { display: "Benin", topAreas: ["Ganvié stilt village", "Pendjari National Park", "Ouidah's historic sites"] },
    "Eq. Guinea": { display: "Equatorial Guinea", topAreas: ["Malabo", "Monte Alén National Park", "Bioko Island beaches"] },
    "Ethiopia": { display: "Ethiopia", topAreas: ["Lalibela's rock churches", "Simien Mountains", "Danakil Depression"] },
    "Eritrea": { display: "Eritrea", topAreas: ["Asmara's Art Deco streets", "Dahlak Archipelago", "Red Sea coast"] },
    "Djibouti": { display: "Djibouti", topAreas: ["Lake Assal", "Whale sharks of the Gulf of Tadjoura", "Day Forest National Park"] },
    "Gabon": { display: "Gabon", topAreas: ["Loango National Park", "Libreville", "Lopé National Park"] },
    "Gambia": { display: "The Gambia", topAreas: ["River Gambia National Park", "Kunta Kinteh Island", "Banjul"] },
    "Ghana": { display: "Ghana", topAreas: ["Cape Coast Castle", "Kakum National Park canopy walk", "Accra"] },
    "Guinea": { display: "Guinea", topAreas: ["Fouta Djallon highlands", "Îles de Los", "Conakry"] },
    "Côte d'Ivoire": { display: "Côte d'Ivoire", topAreas: ["Abidjan's skyline", "Taï National Park", "Grand-Bassam"] },
    "Kenya": { display: "Kenya", topAreas: ["Maasai Mara Great Migration", "Amboseli's elephants & Kilimanjaro views", "Diani Beach"], hasTours: true, searchTerm: "kenya" },
    "Lesotho": { display: "Lesotho", topAreas: ["Maletsunyane Falls", "Sani Pass", "Sehlabathebe National Park"] },
    "Liberia": { display: "Liberia", topAreas: ["Sapo National Park", "Robertsport's surf beaches", "Monrovia"] },
    "Libya": { display: "Libya", topAreas: ["Leptis Magna ruins", "Sahara's Acacus Mountains", "Tripoli's old town"] },
    "Madagascar": { display: "Madagascar", topAreas: ["Avenue of the Baobabs", "Andasibe-Mantadia lemurs", "Nosy Be beaches"] },
    "Malawi": { display: "Malawi", topAreas: ["Lake Malawi", "Liwonde National Park", "Mount Mulanje"] },
    "Mali": { display: "Mali", topAreas: ["Timbuktu", "Djenné's Great Mosque", "Bandiagara Escarpment"] },
    "Mauritania": { display: "Mauritania", topAreas: ["Chinguetti's ancient library", "Banc d'Arguin National Park", "Nouakchott"] },
    "Mauritius": { display: "Mauritius", topAreas: ["Le Morne Brabant", "Black River Gorges", "Port Louis"] },
    "Morocco": { display: "Morocco", topAreas: ["Sahara dunes at Merzouga", "Marrakech's medina", "Atlas Mountains"], hasTours: true, searchTerm: "morocco" },
    "Mozambique": { display: "Mozambique", topAreas: ["Bazaruto Archipelago", "Gorongosa National Park", "Ilha de Moçambique"] },
    "Namibia": { display: "Namibia", topAreas: ["Sossusvlei's red dunes", "Etosha National Park", "Skeleton Coast"] },
    "Niger": { display: "Niger", topAreas: ["Aïr Mountains", "W National Park", "Agadez's old town"] },
    "Nigeria": { display: "Nigeria", topAreas: ["Lagos", "Yankari National Park", "Obudu Mountain Resort"] },
    "Guinea-Bissau": { display: "Guinea-Bissau", topAreas: ["Bijagós Archipelago", "Bissau's old town", "Orango Islands"] },
    "Rwanda": { display: "Rwanda", topAreas: ["Volcanoes National Park gorilla trekking", "Lake Kivu", "Kigali"], hasTours: true, searchTerm: "rwanda" },
    "São Tomé and Principe": { display: "São Tomé and Príncipe", topAreas: ["Obô Natural Park rainforest", "Príncipe's beaches", "São Tomé town"] },
    "Senegal": { display: "Senegal", topAreas: ["Gorée Island", "Lake Retba (Pink Lake)", "Djoudj bird sanctuary"] },
    "Seychelles": { display: "Seychelles", topAreas: ["Anse Source d'Argent, La Digue", "Vallée de Mai, Praslin", "Mahé's beaches"], hasTours: true, searchTerm: "seychelles" },
    "Sierra Leone": { display: "Sierra Leone", topAreas: ["Freetown Peninsula beaches", "Tiwai Island", "Outamba-Kilimi National Park"] },
    "Somalia": { display: "Somalia", topAreas: ["Lido Beach, Mogadishu", "Laas Geel rock art", "Puntland coastline"] },
    "South Africa": { display: "South Africa", topAreas: ["Cape Town & the Winelands", "Kruger National Park", "Garden Route"], hasTours: true, searchTerm: "south africa" },
    "Zimbabwe": { display: "Zimbabwe", topAreas: ["Victoria Falls", "Hwange National Park", "Great Zimbabwe ruins"], hasTours: true, searchTerm: "zimbabwe" },
    "S. Sudan": { display: "South Sudan", topAreas: ["Boma National Park", "Sudd wetlands", "Juba"] },
    "Sudan": { display: "Sudan", topAreas: ["Pyramids of Meroë", "Nile confluence at Khartoum", "Red Sea coast"] },
    "W. Sahara": { display: "Western Sahara", topAreas: ["Dakhla's lagoon", "Laâyoune", "Atlantic coastline"] },
    "eSwatini": { display: "Eswatini", topAreas: ["Hlane Royal National Park", "Ezulwini Valley", "Mlilwane Wildlife Sanctuary"] },
    "Togo": { display: "Togo", topAreas: ["Lomé", "Koutammakou (Batammariba villages)", "Lake Togo"] },
    "Tunisia": { display: "Tunisia", topAreas: ["Sidi Bou Said", "Carthage ruins", "Sahara at Douz"] },
    "Uganda": { display: "Uganda", topAreas: ["Bwindi gorilla trekking", "Murchison Falls", "Lake Bunyonyi"] },
    "Egypt": { display: "Egypt", topAreas: ["Pyramids of Giza", "Nile River cruise", "Luxor's Valley of the Kings"], hasTours: true, searchTerm: "egypt" },
    "Tanzania": { display: "Tanzania", topAreas: ["Serengeti & Ngorongoro Crater", "Zanzibar's beaches", "Mount Kilimanjaro"], hasTours: true, searchTerm: "tanzania" },
    "Burkina Faso": { display: "Burkina Faso", topAreas: ["Sindou Peaks", "Ouagadougou", "Banfora waterfalls"] },
    "Zambia": { display: "Zambia", topAreas: ["Victoria Falls", "South Luangwa National Park", "Lower Zambezi"], hasTours: true, searchTerm: "zambia" }
  };

  window.SH = window.SH || {};
  window.SH.COUNTRY_INFO = COUNTRY_INFO;
})();
