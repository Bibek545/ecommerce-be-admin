import {
  createNewUser,
  getUserByEmail,
  updateUser,
} from "../models/user/UserModel.js";
import { generateJWT } from "../utils/jwt.js";
import { generateRefreshToken } from "../utils/refreshToken.js";
import { verifyRefreshToken } from "../utils/verifyRefreshToken.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { emailTransporter } from "../services/transport.js";
import {
  userAccountVerifiedEmail,
  userActivationEmail,
} from "../services/emailService.js";
import { createNewSession } from "../models/session/sessionModel.js";
import jwt from "jsonwebtoken";
import { deleteSession } from "../../../../LMS/lms-be/src/models/session/SessionModel.js";
import { token } from "morgan";
import { responseClient } from "../middleware/responseClient.js";
import mongoose from "mongoose";

export const addNewUserController = async (req, res, next) => {
  try {
    //1.Extract user data from the request body
    const userObj = req.body;
    //2.create new user in the DB

    const salt = await bcrypt.genSalt(10);
    userObj.password = await bcrypt.hash(userObj.password, salt);

    // create user in DB
    const user = await createNewUser(userObj);

    if (user?._id) {
      const session = await createNewSession({
        // generate UUID session token

        token: uuidv4(),
        association: user.email,
      });

      if (session?._id) {

        // this is imp 

        // const emailToken = jwt.sign(
        //   { email: user.email },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1h" }
        // );
        const url = `${process.env.ROOT_URL}/verify-email?sessionId=${session._id}&t=${session.token}`;

        //send activation email
        console.log(url);

        const emailId = await userActivationEmail({
          email: user.email,
          name: user.fName,
          url,
        });
        console.log(url);
      }

       const message = "we have sent you an email with the activation link. Please check your email.";
   return responseClient({req, res, message});


    }

    throw new Error("Unable to create account, try again later.");

  } catch (error) {
    console.log("Error in register--->",error);
    if(error.message.includes("E11000 duplicate key errror collection")) {
      error.message = "This email already exist, try different email";
      error.statusCode = 400;
    }
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //finding user by email
    //await here
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
    }

    //comapring user password
    //await this

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
    }
    // to check if the user is verified or not
    if (!user.isVerified) {
      return res.status(401).json({
        status: "error",
        message: "Please verify your email before logging in.",
      });
    }

    //generate JWT
    const token = generateJWT({ _id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({
      _id: user._id,
      role: user.role,
    });
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

export const verifyEmailController = async (req, res, next) => {
  
  try {
    const { sessionId, t } = req.body;
    console.log(sessionId, t);

    const session = await deleteSession({
      _id: sessionId,
      token: t,
    });
    console.log(session);

    if (session?._id) {
      //update user to activate
      const user = await updateUser(
        { email: session.association },
        { status: "active" }
      );

      if (user?._id) {
        userAccountVerifiedEmail({ email: user.email, name: user.fName });
        const message = "Your account has been verified, you can log in.";
        return responseClient({ req, res, message });
      }
    }

    const message = " Invalid token or token expired";
    const statusCode = 400;
    return responseClient({ req, res, message });
  } catch (error) {
    next(error);
  }
};
