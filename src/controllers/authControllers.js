import { createNewUser } from "../models/user/UserModel.js"

const addNewUserController = async (req, res, next) => {
    try {
       //1.Extract user data from the request body
        const userObj = req.body;
        //2.create new user in the DB
        const newUser = await createNewUser(userObj);
        //3.send the success response
        res.status(201).json({
            status: "success",
            message: "New user created successfully",
          
        })
    }
    catch (error) {
        next(error)

    }

};
export default addNewUserController;