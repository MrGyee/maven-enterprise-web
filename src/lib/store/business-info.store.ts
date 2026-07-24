import { readJsonFile, writeJsonFile } from "./json-file";
import type { BusinessInfo } from "@/lib/data/types";

const file = "business-info.json";

const fallback: BusinessInfo = {
  legalName: "Maven Enterprise Ltd",
  tagline: "Trusted Interior Solutions Partner in Kenya",
  phones: [],
  whatsappNumber: "",
  email: "",
  address: { street: "", area: "", city: "", country: "Kenya" },
  hours: [],
  socials: { facebook: "", instagram: "", twitter: "", linkedin: "", tiktok: "" },
  mapEmbedUrl: "",
  coordinates: { lat: 0, lng: 0 },
  serviceAreas: [],
};

export const businessInfoStore = {
  get(): BusinessInfo {
    return readJsonFile<BusinessInfo>(file, fallback);
  },
  update(patch: Partial<BusinessInfo>): BusinessInfo {
    const next = { ...businessInfoStore.get(), ...patch };
    writeJsonFile(file, next);
    return next;
  },
};
