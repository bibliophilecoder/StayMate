import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage, connectChat, loadMessages, sendMessage } from "@/services/chat";

type Row = { id: string; text: string; mine: boolean };

export default function Chat() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const demo = id.startsWith("demo-");
  const storageKey = `staymate_chat_${id}`;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Row[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (demo) { AsyncStorage.getItem(storageKey).then(value => { if (value) setMessages(JSON.parse(value)); }); return; }
    let active = true;
    let close: undefined | (() => void);
    loadMessages(id).then(data => { if (active) setMessages(data.map((message, index) => ({ id: message._id ?? String(index), text: message.text, mine: false }))); }).catch(reason => setError(reason.message));
    connectChat(id, (message: ChatMessage) => setMessages(current => current.some(row => row.id === message._id) ? current : [...current, { id: message._id ?? String(Date.now()), text: message.text, mine: false }])).then(socket => { close = () => socket.disconnect(); });
    return () => { active = false; close?.(); };
  }, [id, demo, storageKey]);

  const send = async () => {
    const text = input.trim(); if (!text) return;
    setInput("");
    const optimistic = { id: `local-${Date.now()}`, text, mine: true };
    const next = [...messages, optimistic];
    setMessages(next);
    if (demo) { await AsyncStorage.setItem(storageKey, JSON.stringify(next)); return; }
    try { const saved = await sendMessage(id, text); setMessages(current => current.map(row => row.id === optimistic.id ? { ...row, id: saved._id ?? row.id } : row)); }
    catch (reason) { setMessages(current => current.filter(row => row.id !== optimistic.id)); setError(reason instanceof Error ? reason.message : "Message failed"); }
  };

  return <SafeAreaView className="flex-1 bg-mist"><View className="flex-row items-center border-b border-slate-200 bg-white px-5 py-4"><Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={25} /></Pressable><View className="ml-4"><Text className="text-lg font-extrabold text-ink">{name ?? "Roommate chat"}</Text><Text className="text-xs font-semibold text-emerald">{demo ? "Demo conversation" : "Private match conversation"}</Text></View></View><KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>{error && <Text className="bg-red-50 px-5 py-2 text-red-600">{error}</Text>}<FlatList data={messages} keyExtractor={item => item.id} contentContainerClassName="p-5 gap-3" ListEmptyComponent={<Text className="mt-16 text-center text-slate-500">Say hello and compare living routines.</Text>} renderItem={({ item }) => <View className={`max-w-[82%] rounded-3xl px-4 py-3 ${item.mine ? "self-end rounded-br-md bg-primary" : "self-start rounded-bl-md bg-white"}`}><Text className={`leading-6 ${item.mine ? "text-white" : "text-ink"}`}>{item.text}</Text></View>} /><View className="flex-row items-center gap-3 border-t border-slate-200 bg-white p-4"><TextInput value={input} onChangeText={setInput} onSubmitEditing={() => void send()} placeholder="Write a message…" className="h-12 flex-1 rounded-full bg-mist px-4 text-ink" /><Pressable onPress={() => void send()} className="h-12 w-12 items-center justify-center rounded-full bg-primary"><Ionicons name="send" size={20} color="white" /></Pressable></View></KeyboardAvoidingView></SafeAreaView>;
}
