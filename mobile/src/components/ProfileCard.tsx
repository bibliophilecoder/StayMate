import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Profile } from "@/types";
import { profileArtwork } from "@/theme/pixelAssets";
import { Chip } from "./ui";

export function ProfileCard({ profile }: { profile: Profile }) {
  return <View className="overflow-hidden rounded-card border border-slate-100 bg-white shadow-lg">
    <View className="h-[320px] items-center justify-end bg-[#FFF9F2]">
      <View className="absolute left-7 top-7 h-3 w-3 bg-lavender" />
      <View className="absolute right-9 top-14 h-2 w-2 bg-green-100" />
      <Image source={profileArtwork(profile)} contentFit="contain" style={{ height: 300, width: "92%" }} />
    </View>
    <View className="p-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-3xl font-extrabold text-ink">{profile.name}, {profile.age}</Text>
          <Text className="mt-2 text-base text-ink"><Ionicons name="briefcase-outline" size={16} />  {profile.occupation}</Text>
          <Text className="mt-1 text-base text-slate-500"><Ionicons name="location-outline" size={16} />  {profile.city}</Text>
        </View>
        <View className="rounded-2xl bg-green-50 p-3">
          <Text className="text-2xl font-extrabold text-emerald">{profile.compatibility.overall}%</Text>
          <Text className="text-xs font-bold text-emerald">Compatible</Text>
        </View>
      </View>
      <View className="mt-4 flex-row flex-wrap">{profile.compatibility.common.slice(0, 4).map((item, index) => <Chip key={item} label={item} tone={index % 2 ? "blue" : "green"} />)}</View>
      <Text className="mt-5 rounded-2xl bg-mist p-4 text-[15px] leading-6 text-slate-600">{profile.bio}</Text>
    </View>
  </View>;
}
