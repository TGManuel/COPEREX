
import User from "../auth/user.model.js";

export const existentUserById = async (id = "") => {
    const userExist = await User.findById(id);

    if (!userExist) {
        throw new Error(`The ID ${id} does not exist`);
    }
};