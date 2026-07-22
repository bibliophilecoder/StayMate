import { getApp, getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, deleteUser, getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { api } from "./api";

const config={apiKey:process.env.EXPO_PUBLIC_FIREBASE_API_KEY,authDomain:process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,projectId:process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,appId:process.env.EXPO_PUBLIC_FIREBASE_APP_ID};
export const firebaseConfigured=Boolean(config.apiKey&&config.projectId&&config.appId);
const app=getApps().length?getApp():initializeApp(config);
export const auth=getAuth(app);
async function exchange(){const idToken=await auth.currentUser?.getIdToken(true);if(!idToken)throw new Error("Firebase did not return an identity token");const{data}=await api.post("/auth/firebase",{idToken});await SecureStore.setItemAsync("staymate_token",data.token);return data.user;}
export async function emailLogin(email:string,password:string){await signInWithEmailAndPassword(auth,email,password);return exchange()}
export async function emailRegister(name:string,email:string,password:string){const result=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(result.user,{displayName:name});return exchange()}
export async function googleLogin(idToken:string){await signInWithCredential(auth,GoogleAuthProvider.credential(idToken));return exchange()}
export const resetPassword=(email:string)=>sendPasswordResetEmail(auth,email);
export async function logout(){await signOut(auth);await SecureStore.deleteItemAsync("staymate_token")}
export async function deleteFirebaseAccount(){if(auth.currentUser)await deleteUser(auth.currentUser);await SecureStore.deleteItemAsync("staymate_token")}
