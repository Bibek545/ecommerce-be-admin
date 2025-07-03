import bcrypt from "bcryptjs";
const saltRound = 10;

const hashPassword =  (plainPassword) => {
    return  bcrypt.hashSync(plainPassword, saltRound);
}

export default hashPassword;