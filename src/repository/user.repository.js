import { UserDao } from "../daos/factory.js"


export class UserRepository{
        constructor (userDao){
            this.dao = userDao 
        }

    getUsers =async () => await this.dao.getUsers()

    getUser = async(filter) =>await this.dao.getUser(filter)

    createUser = async(userNew) => {
        const newUserDto = new UserDao(userNew)
        return await this.dao.createUser(newUserDto)
    }

    updateUser= async(uid, userToUpdate) =>await this.dao.updateUser({_id: uid}, userToUpdate,)

    deleteUser = async(uid) => this.dao.deleteUser({_id:uid})
}