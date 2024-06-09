import UserModel from "../Models/UserModel.js"
import Jwt from "jsonwebtoken";

const UserContext = {
    getUserById: async(id)=>{
        console.log('get user by id')
        let user = await UserModel.findById(id)
        return user
    },
    getAllUsers: async()=>{
        // console.log('users list')
        let usersList = await UserModel.find()
        return usersList
    },
    getUsersAgree: async()=>{
        console.log('getUsersAgree')
        let usersList = await UserModel.find({'getCollaborations':true})
        return usersList
    },
    addUser: async({name,email,password,profile,role,getCollaborations})=>{
        console.log('add user')
        let check = await UserModel.findOne({"email":email})
        if (check)
        {   
            return false
        }
        else
        {
            let added = new UserModel({name,email,password,profile,role,getCollaborations})
            added.save()
            return added
        }
    },
    updateUser: async(id,user)=>{
        console.log(`update user`)
        let updated = await UserModel.findByIdAndUpdate(id,user,{new:true})
        return updated
    },
    deleteUser: async(id)=>{
        console.log(`delete user`)
        let deleted = await UserModel.findByIdAndDelete(id)
        return deleted
    },
    deleteAllUsers: async()=>{
        console.log(`delete all Users`)
        let deletedList = await UserModel.find().deleteMany()
        return deletedList
    },
    checkUser: async ({email,password}) =>{
        console.log(`check user`)
        console.log(email + ' ' + password)
        const check = await UserModel.findOne({"email":email,"password":password})
        const secret = "JIUWfv!@$yxfxx?jh"
        if(check)
        {
            try{
                const token = Jwt.sign({id:check.id,email:check.email},secret)
                console.log(check.id)
                return {token:token,user:check}
            }
            catch{
                return 'token'
            }   
        }
        else{
        console.log(`check user 3`)
            const check2 = await UserModel.findOne({"email":email})
            if(check2){
            console.log(check2)
                return {token:'wrong password'}
            }
            else{
            return {token:'wrong userName or password'}

            }
        }

    }
}
export default UserContext