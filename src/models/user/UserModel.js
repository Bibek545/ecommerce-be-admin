import UserSchema from "./UserSchema.js";

//creating a new user
export const createNewUser = (userobj) => {
    return UserSchema(userobj).save();
}