import { Router } from "express";
import jwt from "jsonwebtoken";
import { cert,getApps,initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

const router=Router();
function firebase(){if(!getApps().length){if(!env.FIREBASE_PROJECT_ID||!env.FIREBASE_CLIENT_EMAIL||!env.FIREBASE_PRIVATE_KEY)throw Object.assign(new Error("Firebase Admin is not configured"),{status:503});initializeApp({credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,"\n")})})}return getAuth()}
router.post("/firebase",async(req,res,next)=>{try{const decoded=await firebase().verifyIdToken(req.body.idToken);const user=await User.findOneAndUpdate({firebaseUid:decoded.uid},{$setOnInsert:{email:decoded.email,name:decoded.name??"StayMate member"}},{upsert:true,new:true});const token=jwt.sign({},env.JWT_SECRET,{subject:user.id,expiresIn:"7d"});res.json({token,user})}catch(e){next(e)}});
export default router;
