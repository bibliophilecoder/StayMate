import type { ImageSource } from "expo-image";
import type { Profile } from "@/types";

const avatars: ImageSource[] = [
  require("../../assets/avatars/avatar-riya.png"),
  require("../../assets/avatars/avatar-arjun.png"),
  require("../../assets/avatars/avatar-aanya.png"),
  require("../../assets/avatars/avatar-kabir.png"),
  require("../../assets/avatars/avatar-meera.png"),
  require("../../assets/avatars/avatar-dev.png"),
];

const namedAvatars: Record<string, ImageSource> = {
  riya: avatars[0], arjun: avatars[1], aanya: avatars[2],
  kabir: avatars[3], meera: avatars[4], dev: avatars[5],
  isha: avatars[0], rohan: avatars[1],
};

function stableIndex(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  return hash % avatars.length;
}

export function profileArtwork(profile: Pick<Profile, "id" | "name" | "image">): ImageSource {
  if (profile.image) return { uri: profile.image };
  const name = profile.name.trim().toLowerCase();
  return namedAvatars[name] ?? avatars[stableIndex(profile.id || name)];
}

export function fallbackAvatar(id?: string, name?: string, imageUrl?: string): ImageSource {
  if (imageUrl) return { uri: imageUrl };
  const key = (name ?? "").trim().toLowerCase();
  return namedAvatars[key] ?? avatars[stableIndex(id || key || "staymate")];
}

const lifestyleIcons: Record<string, ImageSource> = {
  Vegetarian: require("../../assets/lifestyle/vegetarian.png"),
  "Non-Vegetarian": require("../../assets/lifestyle/non-vegetarian.png"),
  Vegan: require("../../assets/lifestyle/vegan.png"), Jain: require("../../assets/lifestyle/jain.png"),
  "Early sleeper": require("../../assets/lifestyle/early-sleeper.png"),
  "Night owl": require("../../assets/lifestyle/night-owl.png"),
  Introvert: require("../../assets/lifestyle/introvert.png"), Ambivert: require("../../assets/lifestyle/ambivert.png"), Extrovert: require("../../assets/lifestyle/extrovert.png"),
  Homebody: require("../../assets/lifestyle/homebody.png"),
  "Occasionally party": require("../../assets/lifestyle/occasional-party.png"),
  "Party lover": require("../../assets/lifestyle/party-lover.png"),
  "Love cooking": require("../../assets/lifestyle/love-cooking.png"),
  "Can cook": require("../../assets/lifestyle/can-cook.png"),
  "Cannot cook": require("../../assets/lifestyle/cannot-cook.png"),
  Never: require("../../assets/lifestyle/guests-never.png"), Sometimes: require("../../assets/lifestyle/guests-sometimes.png"), Frequently: require("../../assets/lifestyle/guests-frequently.png"),
  Student: require("../../assets/lifestyle/student.png"),
  "Working professional": require("../../assets/lifestyle/working-professional.png"),
  WFH: require("../../assets/lifestyle/wfh.png"), Hybrid: require("../../assets/lifestyle/hybrid.png"),
  Love: require("../../assets/lifestyle/pets-love.png"), Okay: require("../../assets/lifestyle/pets-okay.png"),
  "Not comfortable": require("../../assets/lifestyle/pets-okay.png"),
};

export function lifestyleArtwork(option: string): ImageSource {
  return lifestyleIcons[option] ?? lifestyleIcons.Okay;
}
