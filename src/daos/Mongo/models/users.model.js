import mongoose from "mongoose";

const { Schema } = mongoose;

const usersCollection = "users"

const usersSchema = new Schema({
    first_name: {
    type: String,
    required: true,
},
last_name: {
    type: String,
    required: true,
},

email: {
    type: String,
    required: true,
    unique: true,
    index: true
},
password: {
    type: String,
    require: true
    
},
role: {
    type: String,
    enum: ["USER","USER_PREMIUM", "ADMIN"],
    default: "USER",
},
age:{
    type: Number
},
cartID:{
type: mongoose.Schema.Types.ObjectId,
ref: "carts"
},
Active: {
    type: Boolean,
    default: true, 

}
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel