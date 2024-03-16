import { faker, ro } from "@faker-js/faker";
import { Router } from "express";


const userFakeRouter = Router()

const generateProducts = () =>{

    return{
        title:faker.commerce.productName(),
        price: faker.commerce.price (),
        departament: faker.commerce.department(),
        stock: parseInt(faker.string.numeric()),
        description : faker.commerce.productDescription(),
        id: faker.database.mongodbObjectId(),
        image: faker.image.url()
    }
}

const generateUser = ()=>{
    let numberOfProducts = parseInt(faker.string.numeric(1, {bannedDigits: ["0"]}))
    let products = []

    for (let i= 0; i < numberOfProducts; i++) {
        products.push(generateProducts())
        
    }
    return {
        id:faker.database.mongodbObjectId(),
        first_name:faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        birthDate:faker.date.birthdate(),
        phone: faker.phone.number(),
        image:faker.image.avatar(),
        email : faker.internet.email(),
        products
    }
}

userFakeRouter.get("/users", (req, res)=>{
    let users= []
    for (let i= 0; i <10; i++){
        users.push(generateUser())
    }
    res.send({
        status: '',
        payload: users
    })
    
})

export default userFakeRouter