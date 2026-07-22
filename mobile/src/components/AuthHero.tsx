import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export function AuthHero({ mode }: { mode: "login" | "register" }) {
  return <View className="mx-5 mt-2 h-56 overflow-hidden rounded-[32px] bg-primary">
    <Image source={require("../../assets/images/staymate-room.png")} contentFit="cover" contentPosition="center" style={{ position: "absolute", width: "100%", height: "100%" }} />
    <LinearGradient colors={["rgba(19,33,60,0.08)", "rgba(82,103,232,0.84)"]} locations={[0.2, 1]} style={{ position: "absolute", width: "100%", height: "100%" }} />
    <View className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/90 px-4 py-2"><Text className="text-lg font-black text-primary">StayMate⌂</Text></View>
    <View className="absolute bottom-5 left-5 right-5">
      <Text className="text-3xl font-black text-white">{mode === "login" ? "Welcome home" : "Make yourself at home"}</Text>
      <Text className="mt-1 text-sm font-semibold leading-5 text-white/90">{mode === "login" ? "Your next great roommate may be one swipe away." : "Create your account and find someone who fits your way of living."}</Text>
    </View>
    <View className="absolute right-5 top-6 h-3 w-3 bg-green-100" /><View className="absolute right-10 top-12 h-2 w-2 bg-lavender" />
  </View>;
}
