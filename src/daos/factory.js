
import { configObject, connectDB } from "../config/connectDB.js";
import CartDaoMongo from "./Mongo/CartDaoMongo.js";
import ProductDaoMongo from "./Mongo/ProductsDaoMongo.js";
import TicketDaoMongo from "./Mongo/TicketsDaoMongo.js";
import UserDaoMongo from "./Mongo/UserDaoMongo.js";




export let ProductDao 
export let CartDao
export let TicketsDao
export let UserDao

switch (configObject.persistence) {
    case "FILE":
        
        break;
    

    default:
        connectDB() 
        

        
        ProductDao= ProductDaoMongo;
        CartDao= CartDaoMongo;
        TicketsDao = TicketDaoMongo;
        UserDao = UserDaoMongo

    

        break;
}
