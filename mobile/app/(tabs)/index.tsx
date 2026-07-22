import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useRef } from "react";
import { Animated, Dimensions, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
    <LinearGradient colors={["#F8FAFF", "#EEF2FF", "#F5F3FF"]} locations={[0, 0.62, 1]} style={StyleSheet.absoluteFillObject} />
    <View className="absolute -left-20 top-36 h-56 w-56 rounded-full bg-indigo-200/20" />
    <View className="absolute -right-24 bottom-28 h-64 w-64 rounded-full bg-violet-200/20" />
    <View className="flex-row items-center justify-between px-6 py-3">
      <Text className="text-3xl font-black text-[#3F51D8]">StayMate⌂</Text>
      <View className="flex-row gap-4"><Pressable onPress={() => router.push("/filters")}><Ionicons name="options-outline" size={25} color="#13213C" /></Pressable><Ionicons name="notifications-outline" size={25} color="#13213C" /></View>
    </View>
    <ScrollView contentContainerClassName="px-5 pb-32" showsVerticalScrollIndicator={false}>
      <View className="mb-4 items-center"><LinearGradient colors={["rgba(255,255,255,0.98)", "rgba(238,241,255,0.94)"]} style={{ borderRadius: 999, borderWidth: 1, borderColor: "#E0E7FF", paddingHorizontal: 20, paddingVertical: 12 }}><Text className="font-bold text-primary">✦  Find your perfect roommate</Text></LinearGradient></View>
      <Animated.View {...panResponder.panHandlers} style={{ transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }}>
        <Pressable onPress={() => router.push({ pathname: "/profile/[id]", params: { id: profile.id } })}><ProfileCard profile={profile} /></Pressable>
      </Animated.View>
      <Text className="mt-3 text-center text-xs font-semibold text-slate-400">Swipe left to pass · Swipe right to like</Text>
    </ScrollView>
    <View className="absolute bottom-2 left-5 right-5 flex-row items-center justify-center gap-7 rounded-[32px] border border-indigo-100 bg-white/95 px-5 py-3 shadow-lg">
        <Pressable onPress={() => finishSwipe(false)} className="h-16 w-16 items-center justify-center rounded-full bg-white shadow"><Ionicons name="close" size={32} color="#5267E8" /></Pressable>
        <Pressable onPress={() => finishSwipe(true)} className="h-20 w-20 items-center justify-center rounded-full bg-primary shadow"><Ionicons name="heart" size={36} color="white" /></Pressable>
        <Pressable onPress={() => void toggleBookmark(profile.id)} className="h-16 w-16 items-center justify-center rounded-full bg-white shadow"><Ionicons name={bookmarks.includes(profile.id) ? "bookmark" : "bookmark-outline"} size={27} color="#20A464" /></Pressable>
    </View>
  </SafeAreaView>;
}
