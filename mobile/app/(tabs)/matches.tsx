import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { getMatches } from "@/services/profiles";
import { fallbackAvatar } from "@/theme/pixelAssets";

type Match = { _id: string; users: any[]; compatibility?: { overall: number }; lastMessage?: string };

export default function Matches() {
  const { profiles, likes } = useApp();
  const [serverMatches, setServerMatches] = useState<Match[]>([]);
  useFocusEffect(useCallback(() => { getMatches().then(setServerMatches).catch(() => setServerMatches([])); }, []));
  const demoMatches = profiles.filter(profile => likes.includes(profile.id));

  return <SafeAreaView className="flex-1 bg-mist"><ScrollView contentContainerClassName="px-6 pb-8">
    <Text className="pt-4 text-3xl font-black text-ink">Your matches</Text>
    <Text className="mt-1 text-slate-500">People you liked. Demo profiles match instantly for testing.</Text>
    {demoMatches.map(profile => <Pressable key={profile.id} onPress={() => router.push({ pathname: "/chat/[id]", params: { id: `demo-${profile.id}`, name: profile.name } })} className="mt-5 flex-row items-center rounded-3xl bg-white p-4">
      <View className="h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[22px] bg-[#FFF9F2]"><Image source={fallbackAvatar(profile.id, profile.name, profile.image)} contentFit="contain" style={{ width: 64, height: 68 }} /><View pointerEvents="none" className="absolute bottom-0 left-0 right-0 h-[7px] bg-[#FFF9F2]" /></View>
      <View className="ml-4 flex-1"><Text className="text-xl font-extrabold text-ink">{profile.name}, {profile.age}</Text><Text className="mt-1 text-slate-500">Tap to start a conversation</Text></View>
      <Text className="rounded-xl bg-green-50 p-3 font-extrabold text-emerald">{profile.compatibility.overall}%</Text>
    </Pressable>)}
    {serverMatches.map(match => { const profile = match.users?.[0]; return <Pressable key={match._id} onPress={() => router.push({ pathname: "/chat/[id]", params: { id: match._id, name: profile?.name ?? "Roommate" } })} className="mt-5 flex-row items-center rounded-3xl bg-white p-4"><View className="h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[22px] bg-[#FFF9F2]"><Image source={fallbackAvatar(profile?._id, profile?.name, profile?.imageUrl)} contentFit="contain" style={{ width: 64, height: 68 }} /><View pointerEvents="none" className="absolute bottom-0 left-0 right-0 h-[7px] bg-[#FFF9F2]" /></View><View className="ml-4 flex-1"><Text className="text-xl font-extrabold text-ink">{profile?.name ?? "New match"}</Text><Text className="mt-1 text-slate-500">{match.lastMessage ?? "Start the conversation"}</Text></View><Text className="rounded-xl bg-green-50 p-3 font-extrabold text-emerald">{match.compatibility?.overall ?? 0}%</Text></Pressable>; })}
    {!demoMatches.length && !serverMatches.length && <Text className="mt-24 text-center text-slate-500">Like a profile and it will appear here.</Text>}
  </ScrollView></SafeAreaView>;
}
