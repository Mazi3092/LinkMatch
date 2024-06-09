import UserModel from "../Models/UserModel.js";
import Jwt from "jsonwebtoken";

const Auth = {
    find: (token)=>{
        // console.log('token:',token)
        try{
        const decoded = Jwt.verify(token,"JIUWfv!@$yxfxx?jh")
            // console.log('decoded:',decoded)
            return decoded.id
        }
        catch{
            // console.log('decoded')
        }
        // const{name,password}=req.body
        // console.log(name)
        // console.log(req.body)


        // const c  = await UserModel.findOne({name:name})
        // if (c!=null)
        // {
        //     console.log("not exixst")
        //     res.send("not exixst")
        // }
        // else
        // {
        //     console.log(c)
        //     console.log("ok")
        //     res.send("ok")
        // }


    }
}
export default Auth