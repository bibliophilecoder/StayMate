import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { getMatches } from "@/services/profiles";

export default function Chats() {
  const { profiles, likes } = useApp();
  const [matches, setMatches] = useState<any[]>([]);
  useFocusEffect(useCallback(() => { getMatches().then(setMatches).catch(() => setMatches([])); }, []));
  const demoMatches = profiles.filter(profile => likes.includes(profile.id));
  return <SafeAreaView className="flex-1 bg-mist"><ScrollView contentContainerClassName="px-6 pb-8"><Text className="pt-4 text-3xl font-black text-ink">Chats</Text>
    {demoMatches.map(profile => <ChatRow key={profile.id} name={profile.name} copy="Start the conversation" onPress={() => router.push({ pathname: "/chat/[id]", params: { id: `demo-${profile.id}`, name: profile.name } })} />)}
    {matches.map(match => <ChatRow key={match._id} name={match.users?.[0]?.name ?? "Roommate match"} copy={match.lastMessage ?? "Start the conversation"} onPress={() => router.push({ pathname: "/chat/[id]", params: { id: match._id, name: match.users?.[0]?.name ?? "Roommate" } })} />)}
    {!demoMatches.length && !matches.length && <Text className="mt-24 text-center text-slate-500">Like someone to begin a conversation.</Text>}
  </ScrollView></SafeAreaView>;
}

function ChatRow({ name, copy, onPress }: { name: string; copy: string; onPress: () => void }) { return <Pressable onPress={onPress} className="mt-6 flex-row items-center rounded-3xl bg-white p-5"><View className="h-14 w-14 items-center justify-center rounded-2xl bg-lavender"><Ionicons name="chatbubble-ellipses" size={24} color="#5267E8" /></View><View className="ml-4 flex-1"><Text className="text-lg font-extrabold text-ink">{name}</Text><Text className="mt-1 text-slate-500">{copy}</Text></View></Pressable>; }
