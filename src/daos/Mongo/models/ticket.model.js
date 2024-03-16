import mongoose from "mongoose";

const {Schema} = mongoose

const ticketsCollection = "tickets"

const ticketsSchema = new Schema( {

    code: { 
        type: String, 
        required: false, 
     }, 
    
    purchase_datetime: {
        type: Date, 
        default: Date.now }, 

    amount:  { 
        type: Number, 
        required: false }, 

    purchaser: { 
        type: String, 
        required: false } 

})

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

export default ticketsModel

