import SessionSchema from "./sessionSchema.js";
import mongoose from "mongoose";

export const createNewSession = (sessionObj) => {
    return SessionSchema(sessionObj).save();
} 

export const deleteSession=(filter) => {
 return SessionSchema.findOneAndDelete(filter);
}