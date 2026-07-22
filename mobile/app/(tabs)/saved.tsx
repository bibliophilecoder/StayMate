import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { fallbackAvatar } from "@/theme/pixelAssets";

export default function Saved() {
  const { profiles, bookmarks, toggleBookmark } = useApp();
  const saved = profiles.filter(profile => bookmarks.includes(profile.id));

  return <SafeAreaView className="flex-1 bg-mist">
    <ScrollView contentContainerClassName="px-5 pb-10" showsVerticalScrollIndicator={false}>
      <Text className="pt-4 text-3xl font-black text-ink">Saved profiles</Text>
      <Text className="mt-1 text-slate-500">Keep comparing before you make a choice.</Text>
      {saved.map(profile => <Pressable key={profile.id} onPress={() => router.push({ pathname: "/profile/[id]", params: { id: profile.id } })} className="mt-5 flex-row items-center rounded-3xl bg-white p-4 shadow-sm">
        <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] bg-[#FFF9F2]"><Image source={fallbackAvatar(profile.id, profile.name, profile.image)} contentFit="contain" style={{ width: 78, height: 84 }} /><View pointerEvents="none" className="absolute bottom-0 left-0 right-0 h-2 bg-[#FFF9F2]" /></View>
        <View className="ml-4 flex-1"><Text className="text-xl font-extrabold text-ink">{profile.name}, {profile.age}</Text><Text className="mt-1 text-slate-500">{profile.occupation}</Text><Text className="mt-1 text-sm text-slate-400">{profile.city} · {profile.compatibility.overall}% compatible</Text></View>
        <Pressable hitSlop={12} onPress={event => { event.stopPropagation(); void toggleBookmark(profile.id); }} className="h-11 w-11 items-center justify-center rounded-full bg-green-50"><Ionicons name="bookmark" size={23} color="#20A464" /></Pressable>
      </Pressable>)}
      {!saved.length && <View className="mt-24 items-center"><Ionicons name="bookmark-outline" size={54} color="#94A3B8" /><Text className="mt-4 text-xl font-extrabold text-ink">Save someone for later</Text><Text className="mt-2 text-center text-slate-500">Tap the bookmark while discovering profiles.</Text></View>}
    </ScrollView>
  </SafeAreaView>;
}
