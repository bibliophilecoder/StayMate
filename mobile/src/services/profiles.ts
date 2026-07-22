import { api } from "./api";import { Profile } from "@/types";
const fallbackLifestyle={food:"Open to all",sleep:"Flexible",cleanliness:7,social:"Ambivert",party:"Homebody",smoking:false,drinking:false,cooking:"Can cook",guests:"Sometimes",music:"Moderate",workStyle:"Hybrid",pets:"Okay",languages:["English","Hindi"],privacy:8,sharingFood:true,borrowing:false,noiseTolerance:5};
const normalize=(raw:any):Profile=>({...raw,id:raw.id??raw._id,name:raw.name??"StayMate member",age:raw.age??23,gender:raw.gender??"Not specified",occupation:raw.occupation||"StayMate member",organization:raw.organization??"",city:raw.city||raw.preferredCity||"India",preferredCity:raw.preferredCity||raw.city||"India",budgetMin:raw.budgetMin??0,budgetMax:raw.budgetMax??0,bio:raw.bio||"Looking for a considerate roommate and a comfortable place to call home.",image:raw.imageUrl,lifestyle:{...fallbackLifestyle,...raw.lifestyle},compatibility:{overall:raw.compatibility?.overall??50,lifestyle:raw.compatibility?.lifestyle??50,budget:raw.compatibility?.budget??50,location:raw.compatibility?.location??50,summary:raw.compatibility?.summary||"Compare routines and boundaries to see whether you would enjoy sharing a home.",common:raw.compatibility?.common?.length?raw.compatibility.common:["Open communication","Respectful living"]}});
export async function discover(){const{data}=await api.get("/users/discover");return data.map(normalize)}
export async function swipeProfile(id:string,liked:boolean){return (await api.post(`/swipes/${id}`,{liked})).data}
export async function getBookmarks():Promise<Profile[]>{const{data}=await api.get("/bookmarks");return data.map((x:any)=>normalize(x.profile))}
export async function addBookmark(id:string){await api.post(`/bookmarks/${id}`)}
export async function removeBookmark(id:string){await api.delete(`/bookmarks/${id}`)}
export async function getMatches(){return (await api.get("/matches")).data}
export async function saveProfile(payload:Record<string,unknown>){return (await api.patch("/users/me",payload)).data}
export async function deleteAccount(){await api.delete("/users/me")}
