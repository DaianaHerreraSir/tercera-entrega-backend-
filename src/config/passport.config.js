import passport from "passport";
import  local  from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash } from "../utils/hashBcrypt.js";
import { isValidPassword } from "../utils/hashBcrypt.js";
import usersModel from "../daos/Mongo/models/users.model.js";

import passportJWT from "passport-jwt" 
import { configObject } from "./connectDB.js";



const JWTStrategy = passportJWT.Strategy

const ExtractJWT = passportJWT.ExtractJwt
const {jwt_private_key} = configObject
const initializePassport = () => {

  const cookieExtractor = req => {
    let token = null
      if(req && req.cookies){
        token = req.cookies["cookieToken"]
      }
      return token 
    }

    passport.use("jwt", new JWTStrategy({

      jwtFromRequest:  ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: jwt_private_key
    },async (jwt_payload,done)=>{
      try {
        return done (null, jwt_payload)
      } catch (error) {
        return done(error)
        
      }
    }))


    //GITHUB
    passport.use('github', new GitHubStrategy({
      clientID:'Iv1.e5533794a35d6c5a',
      clientSecret: "",
      callbackURL: 'http://localhost:8083/api/session/githubcallback',
  
    }, async (accessToken, refreshToken, profile, done)=>{
      console.log('profile: ', profile)
      try {
              let user = await usersModel.findOne({email: profile._json.email})
              if (!user) {
                  let newUser = {
                      first_name: profile._json.name,
                      last_name: profile._json.name,
                      email: profile._json.email,
                      password: ''
                  }

                  let result = await usersModel.create(newUser)
                  return done(null, result)
              }

              return done(null, user)
      } catch (error) {
          done(error)
      }
  }))

  
} 

export default initializePassport;