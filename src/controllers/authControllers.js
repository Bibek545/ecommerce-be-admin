import { createNewUser, getUserByEmail } from "../models/user/UserModel.js";
import { generateJWT } from "../utils/jwt.js";
import { generateRefreshToken } from "../utils/refreshToken.js";
import { verifyRefreshToken } from "../utils/verifyRefreshToken.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { emailTransporter } from "../services/transport.js";
import { userActivationEmail } from "../services/emailService.js";
import { createNewSession } from "../models/session/sessionModel.js";
import jwt from "jsonwebtoken";

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

           const emailToken = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        const url = `${process.env.ROOT_URL}/activate-user?sessionId=${session._id}&t=${emailToken}`;
     

        //send activation email
        await userActivationEmail({
          email: user.email,
          name: user.fName,
          url,
        });
        console.log(url);
      }
    }
    // Generate JWT
    const token = generateJWT({ _id: user._id, role: user.role });
    user.token = token;
    await user.save();

    // Generate JWT for email verification
    //    const emailToken = jwt.sign(
    //     { email: user.email},
    //     process.env.JWT_SECRET,
    //     {expiresIn: "1h"}
    //    )

    //     //send activation email
    //     await userActivationEmail({
    //         email:user.email,
    //         name:user.fName,
    //         url,
    //     })
    //      console.log(url);

    //3.send the success response
    res.status(201).json({
      status: "success",
      message:
        "New user created successfully. Please check your email to verify your account",
      token,
      user: {
        _id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
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

export const verifyEmailController = (req, res, next) => {
  try {
    const { sessionId, token } = req.body;

    if(!sessionId || !token) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missionh token",
      });
    }


    return res.json ({
      status: "success",
      message: "Your account has been verified",
    });
  } catch(error) {
    next(error);
  }

};