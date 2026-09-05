import type { Retailer } from "@/lib/types";

// Fictional retailers used for MVP mock data. Kept as a flat registry so
// products reference retailers by id rather than duplicating retailer info.
export const retailers = {
  technova: { id: "technova", name: "TechNova" },
  brightbox: { id: "brightbox", name: "BrightBox" },
  clickstore: { id: "clickstore", name: "ClickStore" },
  soundhaus: { id: "soundhaus", name: "SoundHaus" },
  audiomart: { id: "audiomart", name: "AudioMart" },
  mobileday: { id: "mobileday", name: "MobileDay" },
  ringo: { id: "ringo", name: "Ringo Electronics" },
  strideco: { id: "strideco", name: "StrideCo" },
  runlab: { id: "runlab", name: "RunLab" },
  homenest: { id: "homenest", name: "HomeNest" },
  comfortcraft: { id: "comfortcraft", name: "ComfortCraft" },
  brewhouse: { id: "brewhouse", name: "BrewHouse" },
  baristahome: { id: "baristahome", name: "BaristaHome" },
  packrunner: { id: "packrunner", name: "PackRunner" },
  urbanpack: { id: "urbanpack", name: "UrbanPack" },
  glowtech: { id: "glowtech", name: "GlowTech" },
  purebeauty: { id: "purebeauty", name: "PureBeauty" },
} as const satisfies Record<string, Retailer>;
