import * as SecureStore from "expo-secure-store";import { io,Socket } from "socket.io-client";import { api } from "./api";
export type ChatMessage={_id?:string;id?:string;text:string;sender:string|{_id:string};createdAt?:string};
export async function loadMessages(matchId:string){return (await api.get<ChatMessage[]>(`/messages/${matchId}`)).data}
export async function sendMessage(matchId:string,text:string){return (await api.post<ChatMessage>(`/messages/${matchId}`,{text})).data}
export async function connectChat(matchId:string,onMessage:(message:ChatMessage)=>void){const token=await SecureStore.getItemAsync("staymate_token");const base=(process.env.EXPO_PUBLIC_API_URL??"http://localhost:4000/api").replace(/\/api\/?$/,"");const socket:Socket=io(base,{auth:{token},transports:["websocket"]});socket.on("connect",()=>socket.emit("match:join",matchId));socket.on("message:new",onMessage);return socket}
