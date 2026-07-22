import { Lifestyle, Profile } from "@/types";

export const defaultPreferences: Partial<Lifestyle> = {
  food: "Vegetarian", sleep: "Early sleeper", social: "Ambivert", party: "Homebody",
  cooking: "Can cook", guests: "Sometimes", workStyle: "Hybrid", pets: "Okay",
  cleanliness: 8, smoking: false, drinking: false, privacy: 8, noiseTolerance: 5,
};

const fields: (keyof Lifestyle)[] = ["food", "sleep", "social", "party", "cooking", "guests", "workStyle", "pets"];
const labels: Partial<Record<keyof Lifestyle, string>> = { food: "Same food preference", sleep: "Similar sleep schedule", social: "Similar social energy", party: "Matching party lifestyle", cooking: "Compatible cooking habits", guests: "Similar guest preferences", workStyle: "Similar work style", pets: "Pet preferences align" };

export function scoreDemoProfile(profile: Profile, preferences: Partial<Lifestyle>): Profile {
  const answers = { ...defaultPreferences, ...preferences };
  const exact = fields.filter(field => answers[field] === profile.lifestyle[field]);
  const cleanliness = Math.max(0, 100 - Math.abs((answers.cleanliness ?? 8) - profile.lifestyle.cleanliness) * 14);
  const smoking = answers.smoking === profile.lifestyle.smoking ? 100 : 0;
  const drinking = answers.drinking === profile.lifestyle.drinking ? 100 : 25;
  const lifestyle = Math.round((exact.length / fields.length) * 65 + cleanliness * 0.15 + smoking * 0.12 + drinking * 0.08);
  const overall = Math.round(lifestyle * 0.7 + profile.compatibility.budget * 0.2 + profile.compatibility.location * 0.1);
  const common = exact.slice(0, 3).map(field => labels[field] ?? String(profile.lifestyle[field]));
  if (Math.abs((answers.cleanliness ?? 8) - profile.lifestyle.cleanliness) <= 1) common.push("Similar cleanliness");
  if (!profile.lifestyle.smoking && answers.smoking === false) common.push("Non-smokers");
  return { ...profile, compatibility: { ...profile.compatibility, overall, lifestyle, common: common.slice(0, 4), summary: overall >= 80 ? "Your everyday routines align strongly. You are likely to agree on how a comfortable shared home should feel." : overall >= 60 ? "You share several useful habits, with a few differences worth discussing before moving in together." : "Your lifestyles differ in a few important areas. Use chat to compare routines and personal boundaries." } };
}
