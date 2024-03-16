
import { configObject, connectDB } from "../config/connectDB.js";
import CartDaoMongo from "./Mongo/CartDaoMongo.js";
import ProductDaoMongo from "./Mongo/ProductsDaoMongo.js";
import TicketDaoMongo from "./Mongo/TicketsDaoMongo.js";
import UserDaoMongo from "./Mongo/UserDaoMongo.js";



export let UserDao
export let ProductDao 
export let CartDao
export let TicketsDao

switch (configObject.persistence) {
    case "FILE":
        
        break;
    

    default:
        connectDB() 
        

        UserDao = UserDaoMongo;
        ProductDao= ProductDaoMongo;
        CartDao= CartDaoMongo;
        TicketsDao = TicketDaoMongo

    

        break;
}
