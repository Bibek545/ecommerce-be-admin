import sessionSchema from "./sessionSchema.js";

export const createNewSession = (sessionObj) => {
    return sessionSchema(sessionObj).save();
} 

export const deleteSession=(filter) => {
 return sessionSchema.findOneAndDelete(filter);
}