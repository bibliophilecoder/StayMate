import { zodResolver } from "@hookform/resolvers/zod";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { AuthHero } from "@/components/AuthHero";
import { Button, Card, Field } from "@/components/ui";
import { useApp } from "@/context/AppContext";
import { emailLogin, firebaseConfigured, googleLogin } from "@/services/firebase";

WebBrowser.maybeCompleteAuthSession();
const schema = z.object({ email: z.email(), password: z.string().min(6) });
type Form = z.infer<typeof schema>;

export default function Login() {
  const { setAuthenticated, refresh } = useApp();
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const [, response, promptAsync] = Google.useAuthRequest({ webClientId, iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || webClientId, androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID });
  const { control, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const finish = async (userPromise: Promise<unknown>) => { setBusy(true); setSubmitError(""); try { await userPromise; setAuthenticated(true); await refresh(); router.replace("/(tabs)"); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Sign in failed"); } finally { setBusy(false); } };
  useEffect(() => { if (response?.type === "success") { const token = response.authentication?.idToken; if (token) void finish(googleLogin(token)); else setSubmitError("Google did not return an ID token"); } }, [response]);

  return <SafeAreaView className="flex-1 bg-mist"><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1"><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerClassName="pb-10"><AuthHero mode="login" /><Card className="mx-5 -mt-1 border-indigo-100 p-5 shadow-lg"><View className="mb-5 flex-row items-center"><View className="h-10 w-1.5 rounded-full bg-emerald" /><View className="ml-3"><Text className="text-2xl font-black text-ink">Log in</Text><Text className="text-sm text-slate-500">Continue your roommate search</Text></View></View><Controller control={control} name="email" render={({ field: { onChange, value } }) => <Field label="Email address" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} error={errors.email?.message} />} /><Controller control={control} name="password" render={({ field: { onChange, value } }) => <Field label="Password" placeholder="Enter your password" secureTextEntry value={value} onChangeText={onChange} error={errors.password?.message} />} />{submitError ? <Text className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">{submitError}</Text> : null}<View className="gap-3"><Button title={busy ? "Signing in…" : "Log in"} onPress={handleSubmit(values => void finish(emailLogin(values.email, values.password)))} /><Button title="Continue with Google" secondary icon="logo-google" onPress={() => void promptAsync()} /></View>{!firebaseConfigured ? <Text className="mt-4 text-center text-xs text-amber-700">Add Firebase values to enable sign in.</Text> : null}<Text onPress={() => router.push("/(auth)/forgot-password")} className="mt-5 text-center font-bold text-primary">Forgot password?</Text></Card><Text onPress={() => router.push("/(auth)/register")} className="mx-5 mt-5 text-center text-base font-bold text-primary">New to StayMate? Create an account</Text><Text className="mt-3 text-center text-xs font-semibold text-slate-400">Find compatibility. Build connections.</Text></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
