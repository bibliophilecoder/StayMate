import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthHero } from "@/components/AuthHero";
import { Button, Card, Field } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { emailRegister } from "@/services/firebase";

export default function Register() {
  const { setAuthenticated, refresh } = useApp();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async () => { try { setBusy(true); setError(""); if (name.trim().length < 2 || password.length < 8) throw new Error("Enter your name and an 8-character password"); await emailRegister(name.trim(), email.trim(), password); setAuthenticated(true); await refresh(); router.replace("/(tabs)/profile"); } catch (reason) { setError(reason instanceof Error ? reason.message : "Registration failed"); } finally { setBusy(false); } };
  return <SafeAreaView className="flex-1 bg-mist"><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1"><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerClassName="pb-10"><AuthHero mode="register" /><Card className="mx-5 -mt-1 border-indigo-100 p-5 shadow-lg"><View className="mb-5 flex-row items-center"><View className="h-10 w-1.5 rounded-full bg-emerald" /><View className="ml-3"><Text className="text-2xl font-black text-ink">Create your profile</Text><Text className="text-sm text-slate-500">It only takes a minute to begin</Text></View></View><Field label="Full name" value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" /><Field label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" /><Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 8 characters" />{error ? <Text className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</Text> : null}<Button title={busy ? "Creating your account…" : "Create account"} onPress={() => void submit()} /></Card><Text onPress={() => router.replace("/(auth)/login")} className="mx-5 mt-5 text-center text-base font-bold text-primary">Already a member? Log in</Text><Text className="mt-3 text-center text-xs font-semibold text-slate-400">A better match starts with honest preferences.</Text></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
