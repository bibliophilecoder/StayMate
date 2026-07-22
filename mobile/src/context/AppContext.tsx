import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { demoProfiles } from "@/theme/demo";
import { Profile } from "@/types";
import { addBookmark, discover, getBookmarks, removeBookmark, swipeProfile } from "@/services/profiles";
import { registerPush } from "@/services/notifications";

type State={ready:boolean;onboarded:boolean;authenticated:boolean;profiles:Profile[];index:number;bookmarks:string[];likes:string[];loading:boolean;error:string|null;completeOnboarding:()=>void;setAuthenticated:(value:boolean)=>void;refresh:()=>Promise<void>;swipe:(liked:boolean)=>Promise<void>;toggleBookmark:(id:string)=>Promise<void>};
const Context=createContext<State|null>(null);
export function AppProvider({children}:PropsWithChildren){
 const[ready,setReady]=useState(false);const[onboarded,setOnboarded]=useState(false);const[authenticated,setAuthenticated]=useState(false);const[profiles,setProfiles]=useState<Profile[]>(demoProfiles);const[index,setIndex]=useState(0);const[bookmarks,setBookmarks]=useState<string[]>([]);const[likes,setLikes]=useState<string[]>([]);const[loading,setLoading]=useState(false);const[error,setError]=useState<string|null>(null);
 const refresh=useCallback(async()=>{setLoading(true);setError(null);try{const[p,b]=await Promise.all([discover(),getBookmarks()]);setProfiles(p.length?p:demoProfiles);setBookmarks(current=>[...new Set([...current,...b.map(x=>x.id)])]);await registerPush()}catch(e){setError(e instanceof Error?e.message:"Could not refresh StayMate");setProfiles(demoProfiles)}finally{setLoading(false)}},[]);
 useEffect(()=>{Promise.all([AsyncStorage.getItem("onboarded"),AsyncStorage.getItem("staymate_demo_likes"),AsyncStorage.getItem("staymate_demo_bookmarks"),SecureStore.getItemAsync("staymate_token")]).then(([seen,savedLikes,savedBookmarks,token])=>{setOnboarded(seen==="true");setLikes(savedLikes?JSON.parse(savedLikes):[]);setBookmarks(savedBookmarks?JSON.parse(savedBookmarks):[]);setAuthenticated(Boolean(token));setReady(true);if(token)void refresh()})},[refresh]);
 const completeOnboarding=()=>{setOnboarded(true);void AsyncStorage.setItem("onboarded","true")};
 const swipe=async(liked:boolean)=>{const profile=profiles[index%profiles.length];if(!profile)return;setIndex(x=>x+1);if(liked)setLikes(current=>{const next=[...new Set([...current,profile.id])];void AsyncStorage.setItem("staymate_demo_likes",JSON.stringify(next));return next});const isDatabaseProfile=/^[a-f\d]{24}$/i.test(profile.id);if(authenticated&&isDatabaseProfile)try{await swipeProfile(profile.id,liked)}catch(e){setError(e instanceof Error?e.message:"Swipe failed")}};
 const toggleBookmark=async(id:string)=>{const exists=bookmarks.includes(id);const next=exists?bookmarks.filter(value=>value!==id):[...bookmarks,id];setBookmarks(next);const isDatabaseProfile=/^[a-f\d]{24}$/i.test(id);if(!isDatabaseProfile){await AsyncStorage.setItem("staymate_demo_bookmarks",JSON.stringify(next.filter(value=>!(/^[a-f\d]{24}$/i.test(value)))));return}if(authenticated)try{await(exists?removeBookmark(id):addBookmark(id))}catch(e){setBookmarks(current=>exists?[...new Set([...current,id])]:current.filter(value=>value!==id));setError(e instanceof Error?e.message:"Bookmark failed")}};
 const value=useMemo(()=>({ready,onboarded,authenticated,profiles,index,bookmarks,likes,loading,error,completeOnboarding,setAuthenticated,refresh,swipe,toggleBookmark}),[ready,onboarded,authenticated,profiles,index,bookmarks,likes,loading,error,refresh]);return <Context.Provider value={value}>{children}</Context.Provider>
}
export const useApp=()=>{const value=useContext(Context);if(!value)throw new Error("useApp must be inside AppProvider");return value};
