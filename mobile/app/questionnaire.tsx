import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card } from "@/components/ui";
import { lifestyleArtwork } from "@/theme/pixelAssets";

const groups = [
  { title: "Food", items: ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"] },
  { title: "Sleep schedule", items: ["Early sleeper", "Night owl"] },
  { title: "Social personality", items: ["Introvert", "Ambivert", "Extrovert"] },
  { title: "Party lifestyle", items: ["Homebody", "Occasionally party", "Party lover"] },
  { title: "Cooking", items: ["Love cooking", "Can cook", "Cannot cook"] },
  { title: "Guests", items: ["Never", "Sometimes", "Frequently"] },
  { title: "Work style", items: ["Student", "Working professional", "WFH", "Hybrid"] },
  { title: "Pets", items: ["Love", "Okay", "Not comfortable"] },
];

export default function Questionnaire() {
  const [selected, setSelected] = useState<Record<string, string>>({ Food: "Vegetarian", "Sleep schedule": "Early sleeper" });

  return <SafeAreaView className="flex-1 bg-mist">
    <View className="flex-row items-center justify-between px-5 py-4">
      <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={25} /></Pressable>
      <Text className="text-lg font-extrabold text-ink">Your preferences</Text>
      <Text className="font-bold text-primary">Save</Text>
    </View>
    <ScrollView contentContainerClassName="px-5 pb-8">
      <Text className="text-3xl font-black text-ink">Tell us your lifestyle</Text>
      <Text className="mb-5 mt-2 text-slate-500">Honest answers create better matches.</Text>
      {groups.map(group => <View key={group.title} className="mb-5">
        <Text className="mb-2 text-base font-extrabold text-ink">{group.title}</Text>
        <Card className="p-2">
          {group.items.map(item => {
            const active = selected[group.title] === item;
            return <Pressable key={item} onPress={() => setSelected(current => ({ ...current, [group.title]: item }))} className={`mb-1 flex-row items-center rounded-2xl border px-3 py-2 ${active ? "border-indigo-100 bg-lavender" : "border-transparent bg-white"}`}>
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-[#FFF9F2]">
                <Image source={lifestyleArtwork(item)} contentFit="contain" style={{ width: 40, height: 40 }} />
              </View>
              <Text className={`ml-3 flex-1 text-base ${active ? "font-bold text-primary" : "text-ink"}`}>{item}</Text>
              <Ionicons name={active ? "checkbox" : "square-outline"} size={23} color={active ? "#5267E8" : "#94A3B8"} />
            </Pressable>;
          })}
        </Card>
      </View>)}
      <Button title="Save preferences" onPress={() => router.back()} />
    </ScrollView>
  </SafeAreaView>;
}
