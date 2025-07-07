import { createNewUser, getUserByEmail } from "../models/user/UserModel.js"
import { generateJWT } from "../utils/jwt.js";
import {generateRefreshToken} from "../utils/refreshToken.js";
import { verifyRefreshToken } from "../utils/verifyRefreshToken.js";
import bcrypt from "bcryptjs";

export const addNewUserController = async (req, res, next) => {
    try {
       //1.Extract user data from the request body
        const userObj = req.body;
        //2.create new user in the DB

        const salt = await bcrypt.genSalt(10);
        userObj.password = await bcrypt.hash(userObj.password, salt);
        const user = await createNewUser(userObj);
        const token = generateJWT({ _id: user._id, role: user.role });

        //3.send the success response
        res.status(201).json({
            status: "success",
            message: "New user created successfully",
            token,
            user: {
                _id: user._id,
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                role: user.role,
            },
          
        });
    }
    catch (error) {
        next(error)

    }

};

export const loginController = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        
        //finding user by email 
        //await here
        const user = await getUserByEmail(email);
        if(!user) {
            return res.status(401).json ({
                status: "error",
                message: "Invalid username or password"
            });
        }
        

        //comapring user password
        //await this

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid username or password"
            });
        }
       
        //generate JWT 
        const token = generateJWT({_id: user._id, role:user.role});
        const refreshToken = generateRefreshToken({_id: user._id, role:user.role});
        res.json({
            status: "success",
            message: "Login successful",
            token,
            refreshToken,
            user: {
                _id: user._id,
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                role: user.role,
            },
        });


    } catch (error) {
        next(error);

    }

};
