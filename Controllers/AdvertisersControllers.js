import axios from "axios";
import UserContext from "../Contexts/UserContext.js"
import LinkModel from "../Models/LinkModel.js";
import UserModel from "../Models/UserModel.js";
import AdvertiserContext from "../Contexts/AdvertiserContext.js";
import LinkContext from "../Contexts/LinkContext.js";
const AdvertisersControllers = {
    getById:async(req,res)=>{
        let advertiser = await AdvertiserContext.getAdvertiserById(req.params.id)
        res.send(advertiser)
    },
    getList:async(req,res)=>{
        let advertisersList = await AdvertiserContext.getAlladvertisers()
        res.send(advertisersList)
    },
    add:async(req,res)=>{
        const userId = req.id
        const details = req.body.formData
        console.log(details)
        const a = await UserContext.getUserById(userId) 
        if(a.role=='advertiser')
        {
            res.send('This email is already registered in the system')
        }
        else{
        const profile = a.profile
        const name = a.name
        const d = new Date()
        const day = d.getUTCDate();
        const month = d.getUTCMonth() + 1; // החודשים ב-JavaScript מתחילים מ-0, לכן מוסיפים 1
        const year = d.getUTCFullYear();
// תצוגה של התאריך בפורמט הרצוי
        const entryDate = day + '-' + month + '-' + year
        console.log('userId:' + userId + ' profile:' + profile +' details:' + {details})
        let added = await AdvertiserContext.addAdvertiser(name,userId,profile,details,entryDate)
        console.log(added.id)
        if(added)
        {
            a.role = 'advertiser'
            a.advertiserId=added.id
            let updated = await UserContext.updateUser(userId,a);
            console.log('added succesfull')
            // const token = await AdvertiserContext.checkAdvertiser({name,password})
            // console.log('token',token)
            res.send(added)
        }
        else{
            res.send('This email is already registered in the system')
        }
        }
    },
    update:async(req,res)=>{
       const {id} = req.params
       const user = req.body
       let updated = await AdvertiserContext.updateAdvertiser(id,user);
       res.send(updated)
    },
    updateLinks:async(req,res)=>{
        const {id} = req.params
        const advertiserI = req.body
        let updated = await AdvertiserContext.updateAdvertiser(id,advertiser);
        res.send(updated)
     },
    delete: async(req,res)=>{
        let del = await AdvertiserContext.deleteUser(req.params.id);
        res.send(del)
    },
    deleteAll: async(req,res)=>{
        let delList = await AdvertiserContext.deleteAllAdvertisers();
        res.send(delList)
    },
    Authorization:async(req,res)=>{
        const {name,password}= req.body
        console.log(name)
        console.log(password)
        // const userExsist = await UserModel.findOne({"name":name,"password":password})
        // if(userExsist)
        // res.send(userExsist)
        // else
        // res.send('not exists')
    },
    getUrlsById: async(req,res)=>{
        const id = req.id
        let arr = [],i=0,numAllClicks=0
        console.log('req.id:' + id)
        let user = await UserContext.getUserById(id)
        try{
            let advertiserUrls = await AdvertiserContext.getAdvertiserById(user.advertiserId)
            console.log('advertiserUrls')
            advertiserUrls.links.forEach(async(link) => {
                // console.log(link.url)
                let detailed = await LinkContext.getTarget(link.urlId)
                // console.log('detailed:',detailed)
                link.detailed=detailed
                link.numClicks=detailed.numClicks
                arr[i]={link,detailed:detailed}
                numAllClicks+=link.numClicks
                if(i==advertiserUrls.links.length-1)
                    {
                        advertiserUrls.numAllClicks = numAllClicks
                        await AdvertiserContext.updateAdvertiser(advertiserUrls.id,advertiserUrls)
                        console.log('arr',arr)
                        res.send(arr) 
                        
                    }
                i++

            });
        }catch (error) {
            console.log("not found") 
            res.status(500).send({ message: 'Error updating profile' });
          }
    },
    ipp:async(req,res)=>{
        const ipAddress = '147.234.64.79';
        const apiUrl = `https://ipapi.co/${ipAddress}/json/`
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json()
            console.log(data.ip)
            console.log(data.country_name)
            console.log(data.city)
            console.log(data.region)
            console.log(data.timezone)
        }
            }
       
        
       
    }

export default AdvertisersControllers