import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { Button } from "@/components/ui";
import { useApp } from "@/context/AppContext";
export default function Onboarding(){const{completeOnboarding}=useApp();const go=(path:"/(auth)/register"|"/(auth)/login")=>{completeOnboarding();router.replace(path)};return <SafeAreaView className="flex-1 bg-[#FFFDF9]"><View className="flex-1 px-6 pb-5 pt-3"><View className="items-center py-4"><Text className="text-4xl font-black tracking-tight text-primary">StayMate⌂</Text><Text className="mt-2 text-center text-base text-slate-500">Find compatibility. Build connections.</Text></View><Image source={require("../assets/images/staymate-room.png")} contentFit="cover" style={{flex:1,borderRadius:30,marginVertical:18}}/><Text className="text-center text-3xl font-extrabold leading-10 text-ink">Find your perfect roommate, the smart way.</Text><Text className="mx-4 mb-6 mt-3 text-center text-base leading-6 text-slate-500">Match on the little things that make a home feel right.</Text><View className="gap-3"><Button title="Get started" onPress={()=>go("/(auth)/register")}/><Button title="I already have an account" secondary onPress={()=>go("/(auth)/login")}/></View></View></SafeAreaView>}

