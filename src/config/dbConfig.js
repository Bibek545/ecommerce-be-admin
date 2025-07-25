import mongoose from "mongoose";

export const dbConnect = async() => {

    try {
        if (!process.env.MONGO_URL) {
          throw new Error("Porvide valid mongo url connection string")
        }

        const con = await mongoose.connect(process.env.MONGO_URL);
        if (con) {
            console.log("Mongodb is connected");
            
        };

        
    } catch (error) {
        console.log(error);
        
    }
}
