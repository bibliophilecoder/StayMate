import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useRef } from "react";
import { Animated, Dimensions, PanResponder, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileCard } from "@/components/ProfileCard";
import { useApp } from "@/context/AppContext";

const screenWidth = Dimensions.get("window").width;

export default function Discover() {
  const { profiles, index, swipe, toggleBookmark, bookmarks } = useApp();
  const profile = profiles[index % profiles.length];
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({ inputRange: [-screenWidth, 0, screenWidth], outputRange: ["-10deg", "0deg", "10deg"] });

  const finishSwipe = (liked: boolean) => {
    Animated.timing(position, { toValue: { x: liked ? screenWidth * 1.3 : -screenWidth * 1.3, y: 0 }, duration: 220, useNativeDriver: true }).start(() => {
      position.setValue({ x: 0, y: 0 });
      void swipe(liked);
    });
  };

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_, gesture) => Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderGrant: () => position.setOffset({ x: 0, y: 0 }),
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) > 75 || Math.abs(gesture.vx) > 0.45) finishSwipe(gesture.dx > 0 || gesture.vx > 0);
      else Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    },
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => true,
    onPanResponderTerminate: () => Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start(),
  }), [position, profile?.id]);

  if (!profile) return <SafeAreaView className="flex-1 items-center justify-center bg-mist"><Text className="text-slate-500">No profiles available.</Text></SafeAreaView>;

  return <SafeAreaView className="flex-1 bg-mist">
    <LinearGradient colors={["#F8FAFF", "#EEF2FF", "#F5F3FF"]} locations={[0, 0.62, 1]} className="absolute inset-0" />
    <View className="absolute -left-20 top-36 h-56 w-56 rounded-full bg-indigo-200/20" />
    <View className="absolute -right-24 bottom-28 h-64 w-64 rounded-full bg-violet-200/20" />
    <View className="flex-row items-center justify-between px-6 py-3">
      <Text className="text-3xl font-black text-[#3F51D8]">StayMate⌂</Text>
      <View className="flex-row gap-4"><Pressable onPress={() => router.push("/filters")}><Ionicons name="options-outline" size={25} color="#13213C" /></Pressable><Ionicons name="notifications-outline" size={25} color="#13213C" /></View>
    </View>
    <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
      <View className="mb-4 items-center"><LinearGradient colors={["rgba(255,255,255,0.98)", "rgba(238,241,255,0.94)"]} className="rounded-full border border-indigo-100 px-5 py-3 shadow-sm"><Text className="font-bold text-primary">✦  Find your perfect roommate</Text></LinearGradient></View>
      <Animated.View {...panResponder.panHandlers} style={{ transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }}>
        <Pressable onPress={() => router.push({ pathname: "/profile/[id]", params: { id: profile.id } })}><ProfileCard profile={profile} /></Pressable>
      </Animated.View>
      <Text className="mt-3 text-center text-xs font-semibold text-slate-400">Swipe left to pass · Swipe right to like</Text>
    </ScrollView>
    <LinearGradient colors={["rgba(255,255,255,0.99)", "rgba(246,247,255,0.97)"]} className="absolute bottom-2 left-5 right-5 flex-row items-center justify-center gap-8 rounded-[32px] border border-indigo-100 px-5 py-3 shadow-lg">
        <Pressable onPress={() => finishSwipe(false)} className="items-center"><View className="h-14 w-14 items-center justify-center rounded-full bg-white shadow"><Ionicons name="close" size={30} color="#5267E8" /></View><Text className="mt-1 text-[11px] font-bold text-slate-500">Pass</Text></Pressable>
        <Pressable onPress={() => finishSwipe(true)} className="items-center"><LinearGradient colors={["#6578F4", "#4559DB"]} className="h-[72px] w-[72px] items-center justify-center rounded-full shadow"><Ionicons name="heart" size={34} color="white" /></LinearGradient><Text className="mt-1 text-[11px] font-extrabold text-ink">Like</Text></Pressable>
        <Pressable onPress={() => void toggleBookmark(profile.id)} className="items-center"><View className="h-14 w-14 items-center justify-center rounded-full bg-white shadow"><Ionicons name={bookmarks.includes(profile.id) ? "bookmark" : "bookmark-outline"} size={25} color="#20A464" /></View><Text className="mt-1 text-[11px] font-bold text-slate-500">Save</Text></Pressable>
    </LinearGradient>
  </SafeAreaView>;
}
