import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { Profile } from "@/types";
import { AvatarScene } from "./AvatarScene";
import { Chip } from "./ui";

export function ProfileCard({ profile }: { profile: Profile }) {
  return <View className="overflow-hidden rounded-card border border-indigo-100 bg-white shadow-lg">
    <View className="h-[320px] overflow-hidden bg-[#FFF9F2]">
      <AvatarScene id={profile.id} name={profile.name} imageUrl={profile.image} />
      <LinearGradient colors={["transparent", "rgba(82,103,232,0.26)"]} locations={[0.55, 1]} style={StyleSheet.absoluteFillObject} />
      {profile.verified && <View className="absolute left-4 top-4 flex-row items-center rounded-full bg-white/95 px-3 py-2 shadow-sm">
        <Ionicons name="checkmark-circle" size={18} color="#20A464" />
        <Text className="ml-1.5 text-xs font-extrabold text-slate-600">Verified</Text>
      </View>}
    </View>
    <LinearGradient colors={["#FFFFFF", "#F8FAFF", "#EEF1FF"]} locations={[0, 0.58, 1]} style={{ padding: 20 }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-3xl font-extrabold text-ink">{profile.name}, {profile.age}</Text>
          <Text className="mt-2 text-base text-ink"><Ionicons name="briefcase-outline" size={16} />  {profile.occupation}</Text>
          <Text className="mt-1 text-base text-slate-500"><Ionicons name="location-outline" size={16} />  {profile.city}</Text>
        </View>
        <LinearGradient colors={["#ECFFF5", "#DDF9EA"]} style={{ borderRadius: 16, borderWidth: 1, borderColor: "#DCFCE7", padding: 12 }}>
          <Text className="text-2xl font-extrabold text-emerald">{profile.compatibility.overall}%</Text>
          <Text className="text-xs font-bold text-emerald">Compatible</Text>
        </LinearGradient>
      </View>
      <View className="mt-4 rounded-2xl border border-white bg-white/75 p-4">
        <Text className="mb-2 text-base font-extrabold text-ink">About Me</Text>
        <Text className="text-[15px] leading-6 text-slate-600">{profile.bio}</Text>
      </View>
      <View className="mt-4 flex-row flex-wrap">{profile.compatibility.common.slice(0, 4).map((item, index) => <Chip key={item} label={item} tone={index % 2 ? "blue" : "green"} />)}</View>
    </LinearGradient>
  </View>;
}
