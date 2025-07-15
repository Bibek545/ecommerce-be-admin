import UserSchema from "./UserSchema.js";

//creating a new user
export const createNewUser = (userobj) => {
    return UserSchema(userobj).save();
}

//getting a user by email
export const getUserByEmail = (email) => {
 return UserSchema.findOne({email})
}


export const updateUser = (filter, update)=>{
    return UserSchema.findOneAndUpdate(filter, update, {new: true});
}