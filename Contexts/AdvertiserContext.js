import AdvertiserModel from "../Models/AdvertiserModel.js";
import Jwt from "jsonwebtoken";

const AdvertiserContext = {
    getAdvertiserById: async (id)=>{
        console.log('get advertiser by id')
        let advertiser = await AdvertiserModel.findById(id)
        return advertiser
    },
    getAdvertiserByUserId: async (userId)=>{
        console.log('get advertiser by id')
        let advertiser = await AdvertiserModel.findOne({"userId":userId})
        return advertiser
    },
    getAlladvertisers: async()=>{
        // console.log('advertisers list')
        let advertisersList = await AdvertiserModel.find()
        return advertisersList
    },
    addAdvertiser: async(name,userId,profile,details,entryDate)=>{
        // let check = await AdvertiserModel.findOne({"userId":userId})
        // const platforms = details.platforms
        let check = false
        if (check)
        {
            console.log(check)
            return false
        }
        else
        {
            let added = new AdvertiserModel({name,userId,profile,details,entryDate})
            added.save()
            return added
        }
    },
    updateAdvertiser: async(id,advertiser)=>{
        console.log(`update advertiser`)
        let updated = await AdvertiserModel.findByIdAndUpdate(id,advertiser,{new:true})
        updated.save();
        return updated
    },
    deleteAdvertiser: async(id)=>{
        console.log(`delete advertiser`)
        let deleted = await AdvertiserModel.findByIdAndDelete(id)
        return deleted
    },
    deleteAllAdvertisers: async()=>{
        console.log('delete all advertisers')
        let deletedList = await AdvertiserModel.find().deleteMany()
        return deletedList
    }
}
export default AdvertiserContext