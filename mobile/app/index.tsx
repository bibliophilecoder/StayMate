import { Redirect } from "expo-router";
import { useApp } from "@/context/AppContext";
export default function Index(){const{ready,onboarded,authenticated}=useApp();if(!ready)return null;return <Redirect href={!onboarded?"/onboarding":authenticated?"/(tabs)":"/(auth)/login"}/>}
