import { api } from "./api";import { Profile } from "@/types";
const normalize=(raw:any):Profile=>({...raw,id:raw.id??raw._id,organization:raw.organization??"",preferredCity:raw.preferredCity??raw.city,image:raw.imageUrl,compatibility:raw.compatibility??{overall:0,lifestyle:0,budget:0,location:0,summary:"",common:[]}});
export async function discover(){const{data}=await api.get("/users/discover");return data.map(normalize)}
export async function swipeProfile(id:string,liked:boolean){return (await api.post(`/swipes/${id}`,{liked})).data}
export async function getBookmarks():Promise<Profile[]>{const{data}=await api.get("/bookmarks");return data.map((x:any)=>normalize(x.profile))}
export async function addBookmark(id:string){await api.post(`/bookmarks/${id}`)}
export async function removeBookmark(id:string){await api.delete(`/bookmarks/${id}`)}
export async function getMatches(){return (await api.get("/matches")).data}
export async function saveProfile(payload:Record<string,unknown>){return (await api.patch("/users/me",payload)).data}
export async function deleteAccount(){await api.delete("/users/me")}
