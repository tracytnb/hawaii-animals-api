export interface Animal {
  id: number;
  common_name: string;
  hawaiian_name: string;
  scientific_name: string;
  category: string;
  animal_class?: string;
  habitat?: string;
  island_found?: string[];
  native_status?: "native" | "endemic" | "introduced" | "invasive";
  conservation_status?: string;
  diet?: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export let animals: Animal[] = [
  {
    id: 1,
    common_name: "Hawaiian Monk Seal",
    hawaiian_name: "ʻIlioholoikauaua",
    scientific_name: "Neomonachus schauinslandi",
    category: "mammal",
    animal_class: "marine mammal",
    habitat: "coastal waters, beaches",
    island_found: ["all main islands", "northwestern hawaiian islands"],
    native_status: "endemic",
    conservation_status: "endangered",
    diet: "fish, octopus, crustaceans",
    description:
      "One of the rarest seals in the world, native only to Hawaiʻi.",
    image_url: "https://example.com/monk-seal.jpg",
  },
  {
    id: 2,
    common_name: "Nene",
    hawaiian_name: "Nēnē",
    scientific_name: "Branta sandvicensis",
    category: "bird",
    animal_class: "goose",
    habitat: "grasslands, shrublands, volcanic slopes",
    island_found: ["hawaii, maui, kauai, molokai"],
    native_status: "endemic",
    conservation_status: "vulnerable",
    diet: "grasses, seeds, leaves, berries",
    description:
      "The Nēnē is the state bird of Hawaiʻi and is found nowhere else in the world.",
    image_url: "https://example.com/nene.jpg",
  },
  {
    id: 3,
    common_name: "Reef Triggerfish",
    hawaiian_name: "Humuhumunukunukuāpuaʻa",
    scientific_name: "Rhinecanthus rectangulus",
    category: "fish",
    animal_class: "reef fish",
    habitat: "coral reefs",
    island_found: ["all islands"],
    native_status: "native",
    conservation_status: "least concern",
    diet: "small invertebrates, algae",
    description: "A colorful reef fish and the official state fish of Hawaiʻi.",
    image_url: "https://example.com/humuhumu.jpg",
  },
  {
    id: 4,
    common_name: "Hawksbill Sea Turtle",
    hawaiian_name: "ʻEa",
    scientific_name: "Eretmochelys imbricata",
    category: "reptile",
    animal_class: "sea turtle",
    habitat: "coral reefs, coastal waters",
    island_found: ["all main islands"],
    native_status: "native",
    conservation_status: "critically endangered",
    diet: "sponges, sea anemones, algae",
    description:
      "A rare sea turtle found in tropical oceans, including Hawaiian waters.",
    image_url: "https://example.com/hawksbill.jpg",
  },
  {
    id: 5,
    common_name: "Iiwi",
    hawaiian_name: "ʻIʻiwi",
    scientific_name: "Drepanis coccinea",
    category: "bird",
    animal_class: "honeycreeper",
    habitat: "native forests",
    island_found: ["hawaii, maui, kauai"],
    native_status: "endemic",
    conservation_status: "vulnerable",
    diet: "nectar, insects",
    description:
      "A bright red native Hawaiian honeycreeper known for its curved bill.",
    image_url: "https://example.com/iiwi.jpg",
  },
];
