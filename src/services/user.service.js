import User from "../db/user.js";

class UserService{

    static RegisterUser = async (username, password, email, profilePictureFileName) => {
        const newUser = new User({username, password, email, profilePictureFileName});
        await newUser.save();
    };

};

export default UserService; 
