import usersModel from "./models/users.model.js";

class UserDaoMongo {

    
    async getUsers(filter){
        return await usersModel.find({filter})
    }

    async getUserBy (filter){
        return await usersModel.findOne(filter)
    }
  
    async createUser(userNew){
        
        return await usersModel.create(userNew)
    }
   
    async updateUser(uid, userToUpdate){
        return await usersModel.findByIdAndUpdate({_id: uid}, userToUpdate)
    }
    async deleteUser(uid){
        return usersModel.findByIdAndDelete({_id: uid})
    } 
}

export default UserDaoMongo


