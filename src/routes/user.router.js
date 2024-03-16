import { Router } from "express";
import usersModel from "../models/users.model.js";
import passportCall from "../middleware/passportCall.js";
import authorization from "../middleware/authentication.middleware.js";
import { UserControllers } from "../controllers/user.controllers.js";

const userRouter = Router()

// userRouter.get("/", passportCall("jwt"),authorization(["USER_PREMIUM", "ADMIN"]), async(req, res)=>{
//     try {
//         const users = await usersModel.find({isActive: true})
//         res.json({
//             status: "succes",
//             results: users
//         })
//     } catch (error) {
//         console.log(error);
        
//     }
// })
const { getUsers,
        getUserBy,
        createUser,
        updateUser,
        deleteUser}= new UserControllers()


userRouter.get("/", getUsers)

userRouter.get("/:uid", getUserBy)

userRouter.post("/",createUser)

userRouter.put("/:uid", updateUser)

userRouter.delete("/:uid", deleteUser)