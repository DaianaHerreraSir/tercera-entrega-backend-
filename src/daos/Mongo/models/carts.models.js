import mongoose from "mongoose";
import productModel from "./products.models.js";


const { Schema } = mongoose;

const cartsCollection = "carts";



const cartsSchema = new Schema({
    products: [{
        product: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 }
    }]
});

cartsSchema.pre("find", function() {
    this.populate('products.product'); 
});

const cartModel = mongoose.model(cartsCollection,cartsSchema);

export default cartModel